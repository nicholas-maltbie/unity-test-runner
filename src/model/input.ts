import UnityVersionParser from './unity-version-parser';
import { getInput } from '@actions/core';

const Input = {
  get testModes() {
    return ['all', 'playmode', 'editmode'];
  },

  isValidFolderName(folderName) {
    const validFolderName = new RegExp(/^(\.|\.\/)?(\.?[\w~]+([ _-]?[\w~]+)*\/?)*$/);

    return validFolderName.test(folderName);
  },

  getFromUser() {
    // Input variables specified in workflow using "with" prop.
    const unityVersion = getInput('unityVersion') || 'auto';
    const customImage = getInput('customImage') || '';
    const rawProjectPath = getInput('projectPath') || '.';
    const customParameters = getInput('customParameters') || '';
    const testMode = (getInput('testMode') || 'all').toLowerCase();
    const rawEnableCodeCoverage = getInput('enableCodeCoverage') || 'false';
    const coverageAssemblyFilters = getInput('coverageAssemblyFilters') || '';
    const rawCoverageResultsPath = getInput('coverageResultsPath') || '';
    const rawArtifactsPath = getInput('artifactsPath') || 'artifacts';
    const rawUseHostNetwork = getInput('useHostNetwork') || 'false';
    const sshAgent = getInput('sshAgent') || '';
    const gitPrivateToken = getInput('gitPrivateToken') || '';
    const githubToken = getInput('githubToken') || '';
    const checkName = getInput('checkName') || 'Test Results';

    // Validate input
    if (!this.testModes.includes(testMode)) {
      throw new Error(`Invalid testMode ${testMode}`);
    }

    if (rawEnableCodeCoverage !== 'true' && rawEnableCodeCoverage !== 'false') {
      throw new Error(`Invalid enableCodeCoverage "${rawEnableCodeCoverage}"`);
    }

    if (rawEnableCodeCoverage !== 'true' && rawEnableCodeCoverage !== 'false') {
      throw new Error(`Invalid enableCodeCoverage "${rawEnableCodeCoverage}"`);
    }

    if (rawEnableCodeCoverage !== 'true' && coverageAssemblyFilters !== '') {
      throw new Error(
        `coverageAssemblyFilters should not be set if enableCodeCoverage is not enabled.`,
      );
    }

    if (coverageAssemblyFilters !== '') {
      throw new Error(
        `coverageAssemblyFilters should not be set if enableCodeCoverage is not enabled.`,
      );
    }

    if (rawEnableCodeCoverage !== 'true' && rawCoverageResultsPath !== '') {
      throw new Error(
        `coverageResultsPath should not be set if enableCodeCoverage is not enabled.`,
      );
    }

    if (!this.isValidFolderName(rawCoverageResultsPath)) {
      throw new Error(`Invalid coverageResultsPath "${rawCoverageResultsPath}"`);
    }

    if (!this.isValidFolderName(rawProjectPath)) {
      throw new Error(`Invalid projectPath "${rawProjectPath}"`);
    }

    if (!this.isValidFolderName(rawArtifactsPath)) {
      throw new Error(`Invalid artifactsPath "${rawArtifactsPath}"`);
    }

    if (rawUseHostNetwork !== 'true' && rawUseHostNetwork !== 'false') {
      throw new Error(`Invalid useHostNetwork "${rawUseHostNetwork}"`);
    }

    // Sanitise input
    const projectPath = rawProjectPath.replace(/\/$/, '');
    const artifactsPath = rawArtifactsPath.replace(/\/$/, '');
    const useHostNetwork = rawUseHostNetwork === 'true';
    const enableCodeCoverage = rawEnableCodeCoverage === 'true';
    const coverageResultsPath = rawCoverageResultsPath.replace(/\/$/, '');
    const editorVersion =
      unityVersion === 'auto' ? UnityVersionParser.read(projectPath) : unityVersion;

    // Return sanitised input
    return {
      editorVersion,
      customImage,
      projectPath,
      customParameters,
      testMode,
      enableCodeCoverage,
      coverageAssemblyFilters,
      coverageResultsPath,
      artifactsPath,
      useHostNetwork,
      sshAgent,
      gitPrivateToken,
      githubToken,
      checkName,
    };
  },
};

export default Input;
