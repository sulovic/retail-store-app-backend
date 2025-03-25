pipeline {
    agent any
    
    environment {
        GIT_URL = 'https://github.com/sulovic/retail-store-app-backend'
        BRANCH = 'main'
        GIT_CREDENTIALS = 'github-credentials'
        SERVER_CREDENTIALS = 'server-credentials'  // Set the Jenkins SSH credentials ID here
        REMOTE_DIR = '/var/www/retail-store-backend/'
        PRODUCTION_SERVER = '94.130.73.137'
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    // SSH into the server and clone the repo
                    sshagent(credentials: [SERVER_CREDENTIALS]) {
                        sh """
                            cd ${REMOTE_DIR} &&
                            git clone -b ${BRANCH} ${GIT_URL} ${REMOTE_DIR}
                        """
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // SSH into the server and install dependencies
                    sshagent(credentials: [SSH_KEY_ID]) {
                        sh """
                            npm install
                        """
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // SSH into the server and run tests
                    sshagent(credentials: [SSH_KEY_ID]) {
                        sh """
                            cd ${REMOTE_DIR} &&
                            npm test
                        """
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // SSH into the server and run the build
                    sshagent(credentials: [SSH_KEY_ID]) {
                        sh """
                            cd ${REMOTE_DIR} &&
                            npm run build
                        """
                    }
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    // SSH into the production server and deploy the application
                    sshagent(credentials: [SSH_KEY_ID]) {
                        sh """
                            ssh ${PRODUCTION_SERVER} "
                                cd ${REMOTE_DIR} &&
                                git pull origin ${BRANCH} &&
                                npm install &&
                                npm run build &&
                                pm2 restart all"
                        """
                    }
                }
            }
        }
    }
}
