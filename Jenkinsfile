pipeline {
    agent {
        docker {
            image 'node:alpine' 
            args '-p 5999:5999'
        }
    }
    environment {
        PORT = 5999
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/your-username/your-repo.git',
                credentialsId: 'github-credentials'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install' 
            }
        }
        stage('Run Lints') {
            steps {
                sh 'npm run lint' 
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm run test' 
            }
        }
        stage('Build Application') {
            steps {
                sh 'npm run build' 
            }
        }
        stage('Start Application') {
            steps {
                sh 'cd /dist && node server.js' 
            }
        }
    }
}
