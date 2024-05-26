pipeline {
    agent {
        label 'front'
    }
    environment {
        PATH="/home/jenkins/soft/nodejs/bin:/var/data/jenkins/node/bin:${env.PATH}"
        NOTIFY_RECEIVERS="dev@coloso.io,27504490@qq.com,xubo@coloso.io,abby@coloso.io,276644176@qq.com"
        NAME="one-help-admin"
    }
    stages {
        stage('build') {
            steps {
                script {
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
            script {
                if (env.JOB_URL.contains("local")) {
                    // sh 'touch test_summary.log; touch test.log; python3 /home/homeplus/service/helper/sendEmail.py "test.log" "$NOTIFY_RECEIVERS" "successfully $NAME[local:$GIT_BRANCH]" "result: $(cat test_summary.log)"  '
                    sh 'bash /home/homeplus/service/helper/compile_notify.sh "successfully compile $NAME[local:$GIT_BRANCH]" '
                } else {
                    // sh 'touch test_summary.log; touch test.log; python3 /home/homeplus/service/helper/sendEmail.py "test.log" "$NOTIFY_RECEIVERS" "successfully $NAME[cloud:$GIT_BRANCH]" "result: $(cat test_summary.log)"  '
                    sh 'bash /home/homeplus/service/helper/compile_notify.sh "successfully compile $NAME[cloud:$GIT_BRANCH]" '
                }
            }
        }
        unsuccessful {
            script {
                if (env.JOB_URL.contains("local")) {
                    // sh 'touch test_summary.log; touch test.log; python3 /home/homeplus/service/helper/sendEmail.py "test.log" "$NOTIFY_RECEIVERS" "failed to compile $NAME[local:$GIT_BRANCH]" "result: $(cat test_summary.log)"  '
                    sh 'bash /home/homeplus/service/helper/compile_notify.sh "failed to compile $NAME[local:$GIT_BRANCH]" '
                } else {
                    // sh 'touch test_summary.log; touch test.log; python3 /home/homeplus/service/helper/sendEmail.py "test.log" "$NOTIFY_RECEIVERS" "failed to compile $NAME[cloud:$GIT_BRANCH]" "result: $(cat test_summary.log)"  '
                    sh 'bash /home/homeplus/service/helper/compile_notify.sh "failed to compile $NAME[cloud:$GIT_BRANCH]" '
                }
            }
        }
    }
}
