---
    title: 젠킨스에 OpenJDK 설치하기
    date: 2020-01-20
    categories: [개발 이야기]
    tags: [Jenkins, OpenJDK]
---

## 젠킨스 JDK 설치
젠킨스에 OpenJDK를 설치해서 빌드에 사용해보겠습니다.

### OpenJDK installer
[openJDK-native-plugin](https://plugins.jenkins.io/openJDK-native-plugin)를 이용하여 JDK를 설치하는 방법입니다.

#### Jenkins Management > Global Tool Configuration > JDK
ADD JDK를 선택 후 ADD INSTALLER를 `OpenJDK installer`로 선택합니다.

선택 옵션은 다음과 같습니다.

- java-1.8.0-openjdk
- java-1.7.0-openjdk
- java-1.6.0-openjdk

> 이 방법은 1.8 까지만 가능하며 RedHat 기반의 리눅스에서만 사용할 수 있습니다.

윈도우에서 이 방식을 사용하면 다음과 같은 오류가 발생합니다.
```sh
FATAL: Node Jenkins doesn't seem to be running on RedHat-like distro
java.lang.IllegalArgumentException: Node Jenkins doesn't seem to be running on RedHat-like distro
	at org.jenkinsci.plugins.openjdk_native.OpenJDKInstaller.isInstalled(OpenJDKInstaller.java:96)
	at org.jenkinsci.plugins.openjdk_native.OpenJDKInstaller.performInstallation(OpenJDKInstaller.java:56)
	at hudson.tools.InstallerTranslator.getToolHome(InstallerTranslator.java:69)
	at hudson.tools.ToolLocationNodeProperty.getToolHome(ToolLocationNodeProperty.java:109)
	at hudson.tools.ToolInstallation.translateFor(ToolInstallation.java:206)
	at hudson.model.JDK.forNode(JDK.java:148)
	at hudson.model.AbstractProject.getEnvironment(AbstractProject.java:341)
	at hudson.model.Run.getEnvironment(Run.java:2383)
	at hudson.model.AbstractBuild.getEnvironment(AbstractBuild.java:864)
	at hudson.plugins.git.GitSCM.checkout(GitSCM.java:1138)
	at hudson.scm.SCM.checkout(SCM.java:505)
	at hudson.model.AbstractProject.checkout(AbstractProject.java:1205)
	at hudson.model.AbstractBuild$AbstractBuildExecution.defaultCheckout(AbstractBuild.java:574)
	at jenkins.scm.SCMCheckoutStrategy.checkout(SCMCheckoutStrategy.java:86)
	at hudson.model.AbstractBuild$AbstractBuildExecution.run(AbstractBuild.java:499)
	at hudson.model.Run.execute(Run.java:1853)
	at hudson.model.FreeStyleBuild.run(FreeStyleBuild.java:43)
	at hudson.model.ResourceController.execute(ResourceController.java:97)
	at hudson.model.Executor.run(Executor.java:427)
Finished: FAILURE
```

### Install from adoptopenjdk.net
[AdoptOpenJDK installer Plugin](https://plugins.jenkins.io/adoptopenjdk)을 이용하여 JDK를 설치하는 방법입니다.

#### Jenkins Management > Global Tool Configuration > JDK
ADD JDK를 선택 후 ADD INSTALLER를 `Install from adoptopenjdk.net`로 선택합니다.

다음과 같은 선택 옵션을 제공합니다.

- OpenJDK 8 - Hotspot / OpenJ9
- OpenJDK 9 - Hotspot / OpenJ9
- OpenJDK 10 - Hotspot / OpenJ9
- OpenJDK 11 - Hotspot / OpenJ9
- OpenJDK 12 - Hotspot / OpenJ9
- OpenJDK 13 - Hotspot / OpenJ9

> 이 방법은 AdoptOpenJDK 웹사이트에 의존하므로 빌드 작업이 실패할 수 있습니다.

윈도우에서 OpenJDK 8은 정상 동작하지만 대부분은 JDK 바이너리파일을 찾을 수 없습니다.
```sh
java.io.IOException: Unable to locate binary. ID: jdk-10.0.2+13, Platform: WINDOWS, CPU: i386
	at io.jenkins.plugins.adoptopenjdk.AdoptOpenJDKInstaller.performInstallation(AdoptOpenJDKInstaller.java:116)
	at hudson.tools.InstallerTranslator.getToolHome(InstallerTranslator.java:69)
	at hudson.tools.ToolLocationNodeProperty.getToolHome(ToolLocationNodeProperty.java:109)
	at hudson.tools.ToolInstallation.translateFor(ToolInstallation.java:206)
	at hudson.model.JDK.forNode(JDK.java:148)
	at hudson.model.AbstractProject.getEnvironment(AbstractProject.java:341)
	at hudson.model.Run.getEnvironment(Run.java:2383)
	at hudson.model.AbstractBuild.getEnvironment(AbstractBuild.java:864)
	at hudson.plugins.git.GitSCM.checkout(GitSCM.java:1138)
	at hudson.scm.SCM.checkout(SCM.java:505)
	at hudson.model.AbstractProject.checkout(AbstractProject.java:1205)
	at hudson.model.AbstractBuild$AbstractBuildExecution.defaultCheckout(AbstractBuild.java:574)
	at jenkins.scm.SCMCheckoutStrategy.checkout(SCMCheckoutStrategy.java:86)
	at hudson.model.AbstractBuild$AbstractBuildExecution.run(AbstractBuild.java:499)
	at hudson.model.Run.execute(Run.java:1853)
	at hudson.model.FreeStyleBuild.run(FreeStyleBuild.java:43)
	at hudson.model.ResourceController.execute(ResourceController.java:97)
	at hudson.model.Executor.run(Executor.java:427)
Finished: FAILURE
```



### Extract \*.zip/\*.tar.gz  


#### Jenkins Management > Global Tool Configuration > JDK
ADD JDK를 선택 후 ADD INSTALLER를 `Extract \*.zip/\*.tar.gz`로 선택합니다.

`Download URL for binary archive` 항목에 다운로드 URL을 입력합니다.

ex) https://download.java.net/java/GA/jdk10/10.0.2/19aef61b38124481863b1413dce1855f/13/openjdk-10.0.2_linux-x64_bin.tar.gz

> OpenJDK GA 릴리즈 버전은 여기에서 확인할 수 있습니다.
> https://jdk.java.net/archive/

`Subdirectory of extracted archive` 항목에는 홈 디렉토리 기준으로 다운로드 될 서브 디렉토리를 입력합니다.

ex) jdk-10.0.2

```sh
Unpacking https://download.java.net/java/GA/jdk10/10.0.2/19aef61b38124481863b1413dce1855f/13/openjdk-10.0.2_windows-x64_bin.tar.gz to C:\Jenkins\tools\hudson.model.JDK\JDK_10.0.2 on Jenkins
using credential **

[Gradle] - Launching build.
[Warnings] $ cmd.exe /C "C:\Jenkins\workspace\demo\gradlew.bat -Djdk=VERSION_1_10 build -x test && exit %%ERRORLEVEL%%"
Starting a Gradle Daemon, 1 incompatible Daemon could not be reused, use --status for details
> Task :processResources
> Task :cleanBootBuildInfo
> Task :bootBuildInfo
> Task :generateLombokConfig UP-TO-DATE

> Task :compileJava

> Task :classes
> Task :bootWar
> Task :war SKIPPED
> Task :assemble
> Task :check
> Task :build
```


## 참고
- https://stackoverflow.com/a/55244659

