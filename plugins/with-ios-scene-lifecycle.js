const { withAppDelegate, withInfoPlist, withPodfile } = require('@expo/config-plugins');

/**
 * Workaround for Xcode 27 / iOS 27: UIKit refuses to launch apps that still
 * create the window in AppDelegate. Expo SDK 54's prebuild template does that.
 * Official scene support exists from SDK 57.0.23 (and is default in SDK 58).
 */

const SCENE_DELEGATE_MARKER = 'class SceneDelegate: UIResponder, UIWindowSceneDelegate';

const sceneConfigurationMethod = `  public func application(
    _ application: UIApplication,
    configurationForConnecting connectingSceneSession: UISceneSession,
    options: UIScene.ConnectionOptions
  ) -> UISceneConfiguration {
    let configuration = UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    configuration.delegateClass = SceneDelegate.self
    return configuration
  }
`;

const sceneDelegateClass = `${SCENE_DELEGATE_MARKER} {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else {
      return
    }

    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
          let factory = appDelegate.reactNativeFactory else {
      return
    }

    let nextWindow = UIWindow(windowScene: windowScene)
    window = nextWindow
    appDelegate.window = nextWindow

    factory.startReactNative(
      withModuleName: "main",
      in: nextWindow,
      launchOptions: appDelegate.launchOptions)

    if !connectionOptions.urlContexts.isEmpty {
      self.scene(scene, openURLContexts: connectionOptions.urlContexts)
    }

    for activity in connectionOptions.userActivities {
      self.scene(scene, continue: activity)
    }
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let urlContext = URLContexts.first,
          let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
      return
    }

    var options: [UIApplication.OpenURLOptionsKey: Any] = [
      .openInPlace: urlContext.options.openInPlace,
    ]

    if let sourceApplication = urlContext.options.sourceApplication {
      options[.sourceApplication] = sourceApplication
    }

    if let annotation = urlContext.options.annotation {
      options[.annotation] = annotation
    }

    _ = appDelegate.application(UIApplication.shared, open: urlContext.url, options: options)
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
      return
    }

    _ = appDelegate.application(
      UIApplication.shared,
      continue: userActivity,
      restorationHandler: { _ in }
    )
  }
}

`;

const STARTUP_BLOCK =
  /#if os\(iOS\) \|\| os\(tvOS\)\s+window = UIWindow\(frame: UIScreen\.main\.bounds\)\s+factory\.startReactNative\(\s+withModuleName: "main",\s+in: window,\s+launchOptions: launchOptions\)\s+#endif/;

function addInfoPlistSceneManifest(config) {
  return withInfoPlist(config, (nextConfig) => {
    nextConfig.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
          },
        ],
      },
    };

    return nextConfig;
  });
}

function patchAppDelegate(contents) {
  if (contents.includes(SCENE_DELEGATE_MARKER)) {
    return contents;
  }

  if (!STARTUP_BLOCK.test(contents)) {
    throw new Error(
      'Could not find the Expo AppDelegate React Native startup block to patch for UIScene lifecycle.',
    );
  }

  let nextContents = contents.replace(
    STARTUP_BLOCK,
    `// Window + startReactNative are owned by SceneDelegate (iOS 27 UIScene lifecycle)`,
  );

  if (!nextContents.includes('var launchOptions:')) {
    nextContents = nextContents.replace(
      'var reactNativeFactory: RCTReactNativeFactory?\n',
      'var reactNativeFactory: RCTReactNativeFactory?\n  var launchOptions: [UIApplication.LaunchOptionsKey: Any]?\n',
    );
  }

  if (!nextContents.includes('self.launchOptions = launchOptions')) {
    nextContents = nextContents.replace(
      'bindReactNativeFactory(factory)\n',
      'bindReactNativeFactory(factory)\n    self.launchOptions = launchOptions\n',
    );
  }

  if (!nextContents.includes('configurationForConnecting connectingSceneSession')) {
    const linkingMarker = '\n  // Linking API';

    if (!nextContents.includes(linkingMarker)) {
      throw new Error('Could not find the AppDelegate linking section to insert the UIScene configuration method.');
    }

    nextContents = nextContents.replace(linkingMarker, `\n${sceneConfigurationMethod}\n  // Linking API`);
  }

  const reactNativeDelegateMarker = '\nclass ReactNativeDelegate: ExpoReactNativeFactoryDelegate';

  if (!nextContents.includes(reactNativeDelegateMarker)) {
    throw new Error('Could not find ReactNativeDelegate to insert SceneDelegate.');
  }

  return nextContents.replace(reactNativeDelegateMarker, `\n${sceneDelegateClass}${reactNativeDelegateMarker}`);
}

function addAppDelegateSceneLifecycle(config) {
  return withAppDelegate(config, (nextConfig) => {
    if (nextConfig.modResults.language !== 'swift') {
      throw new Error(
        `Cannot apply iOS scene lifecycle plugin to ${nextConfig.modResults.language} AppDelegate. Swift is required.`,
      );
    }

    nextConfig.modResults.contents = patchAppDelegate(nextConfig.modResults.contents);
    return nextConfig;
  });
}

const POD_DEPLOYMENT_MARKER = '# Clamp pod deployment targets for Xcode 27 (min iOS 15.0)';

const POD_DEPLOYMENT_SNIPPET = `
    ${POD_DEPLOYMENT_MARKER}
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        if build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'].to_f < 15.1
          build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'
        end
      end
    end
`;

function clampPodDeploymentTargets(config) {
  return withPodfile(config, (nextConfig) => {
    const contents = nextConfig.modResults.contents;

    if (contents.includes(POD_DEPLOYMENT_MARKER)) {
      return nextConfig;
    }

    const postInstallTail =
      ':ccache_enabled => ccache_enabled?(podfile_properties),\n    )';

    if (!contents.includes(postInstallTail)) {
      throw new Error('Could not find Podfile post_install react_native_post_install call to clamp deployment targets.');
    }

    nextConfig.modResults.contents = contents.replace(
      postInstallTail,
      `${postInstallTail}\n${POD_DEPLOYMENT_SNIPPET}`,
    );

    return nextConfig;
  });
}

module.exports = function withIosSceneLifecycle(config) {
  return addAppDelegateSceneLifecycle(addInfoPlistSceneManifest(clampPodDeploymentTargets(config)));
};
