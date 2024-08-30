pipeline {
    agent {
        label 'front'
    }
    environment {
        PATH="${env.HOME}/node/bin:${env.PATH}"
        NAME="one-help-admin"
    }
    stages {
        stage('build') {
            steps {
                script {
                    sh "rm -rf node_modules/"
                    sh "echo branch: ${env.BRANCH_NAME}, job url:${env.JOB_URL}"
                    if (env.BRANCH_NAME == "stage") {
                        sh "yarn install"
                        sh "make stagelocal"
                        sh "make uploadstagelocal"
                    } else if (env.GIT_BRANCH.startsWith("dev") || env.GIT_BRANCH.startsWith("v")) {
                        sh "yarn install"
                        sh "make uatlocal"
                        sh "make uploaduatlocal"
                    } else if (env.BRANCH_NAME == "master" || env.BRANCH_NAME == "main" || env.GIT_BRANCH.startsWith("hotfix/") ) {                        sh "yarn install"
                        sh "make prodlocal"
                    } else {
                        //do nothing
                    }
                }
            }
        }
    }
    post {
        success {
            archiveArtifacts artifacts: 'dist/**,upgrade*.sh', onlyIfSuccessful: true
        }
        always {
            script {
                sh "bash ${env.HOME}/build-utils/jenkins/compile_notify.sh 'Build ${currentBuild.fullDisplayName} - ${currentBuild.currentResult}'"
                sh "python3 ${env.HOME}/build-utils/jenkins/compile_email.py 'Build ${currentBuild.fullDisplayName} - ${currentBuild.currentResult}'"
            }
        }
    }
}
