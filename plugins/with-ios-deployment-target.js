const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Xcode 27 refuses any pod whose IPHONEOS_DEPLOYMENT_TARGET is below 15.0.
 * `expo-build-properties` only sets the Podfile `platform :ios` line and the app
 * target, but some pods (SDWebImage, RNSVG, ReachabilitySwift, RNCAsyncStorage…)
 * keep their own lower podspec targets. This plugin appends a post_install loop
 * that forces every pod target to the given deployment target.
 */
const withIosDeploymentTarget = (config, { deploymentTarget = "15.1" } = {}) => {
  return withDangerousMod(config, [
    "ios",
    (cfg) => {
      const podfilePath = path.join(
        cfg.modRequest.platformProjectRoot,
        "Podfile"
      );
      let contents = fs.readFileSync(podfilePath, "utf8");

      const marker = "# @generated-force-ios-deployment-target";
      if (contents.includes(marker)) {
        return cfg;
      }

      const snippet = `
    ${marker}
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |bc|
        current = bc.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current.nil? || current.to_f < ${deploymentTarget}
          bc.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${deploymentTarget}'
        end
      end
    end
`;

      // Inject right after the react_native_post_install(...) call closes.
      const anchor = /react_native_post_install\([\s\S]*?\)\n/;
      if (anchor.test(contents)) {
        contents = contents.replace(anchor, (match) => match + snippet);
      } else {
        // Fallback: inject at the start of the post_install block body.
        contents = contents.replace(
          /post_install do \|installer\|\n/,
          (match) => match + snippet
        );
      }

      fs.writeFileSync(podfilePath, contents);
      return cfg;
    },
  ]);
};

module.exports = withIosDeploymentTarget;
