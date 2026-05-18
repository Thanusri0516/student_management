# Student Management System

A full-stack web application for managing student information with Spring Boot backend and React frontend, containerized with Docker and orchestrated with Kubernetes.

## Tech Stack

- **Backend**: Spring Boot 4.0.5, Java 17, H2 Database
- **Frontend**: React 19, Axios
- **Build**: Maven, Gradle
- **CI/CD**: Jenkins
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Project Structure

```
student_management-main/
├── demo/                  # Spring Boot backend
│   ├── src/main/java/com/example/demo/
│   │   ├── controller/    # REST APIs
│   │   ├── service/       # Business logic
│   │   ├── repository/    # Data access
│   │   └── model/         # Entities
│   ├── pom.xml            # Maven configuration
│   ├── Dockerfile         # Docker image
│   └── Jenkinsfile        # Jenkins pipeline
│
├── student-frontend/      # React frontend
│   ├── src/
│   ├── package.json
│   ├── Dockerfile         # Docker image
│   └── Jenkinsfile        # Jenkins pipeline
│
├── docker-compose.yml     # Local development
├── k8s/                   # Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-service.yaml
│   └── frontend-service.yaml
└── README.md
```

## Quick Start

### Local Development

#### Backend (Maven)
```bash
cd demo
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8082
```

#### Frontend
```bash
cd student-frontend
npm install
npm start
# Runs on http://localhost:3000
```

#### Docker Compose
```bash
docker-compose up
# Frontend: http://localhost:3001
# Backend: http://localhost:8086
```

## Docker Setup

### Build Images
```bash
# Backend
cd demo
docker build -t student-management-backend:1.0 .

# Frontend
cd student-frontend
docker build -t student-management-frontend:1.0 .
```

### Run Containers
```bash
docker run -p 8082:8082 student-management-backend:1.0
docker run -p 3000:3000 student-management-frontend:1.0
```

## Maven Build

### Build Backend
```bash
cd demo
mvn clean package       # Build JAR
mvn install            # Install to local repository
mvn deploy             # Deploy to remote repository
```

### Run Tests
```bash
mvn test               # Run unit tests
mvn test -DskipTests   # Skip tests during build
```

## Jenkins CI/CD Pipeline

### Setup Jenkins Job
1. Create new Pipeline job in Jenkins
2. Configure Git repository URL
3. Set pipeline script path to `Jenkinsfile`




## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster running
- kubectl configured
- Docker images pushed to registry

### Deploy to Kubernetes
```bash
cd k8s/
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-service.yaml
```

### Check Deployment
```bash
kubectl get pods
kubectl get services
kubectl logs -f deployment/student-backend
kubectl describe pod <pod-name>
```

### Scale Services
```bash
kubectl scale deployment student-backend --replicas=3
kubectl scale deployment student-frontend --replicas=2
```

### Port Forwarding
```bash
kubectl port-forward svc/backend-service 8082:8082
kubectl port-forward svc/frontend-service 3000:3000
```



## API Endpoints

- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/{id}` - Get student by ID
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

## Requirements

- Java 17+
- Node.js 16+
- Maven 3.6+
- Docker 20.10+
- Kubernetes 1.20+
- Jenkins (for CI/CD)

## Database

H2 in-memory database with JPA

- Console: http://localhost:8082/h2-console
- URL: jdbc:h2:mem:testdb
- Username: sa
- Password: (empty)

## Testing

```bash
# Backend - Maven
cd demo && mvn test

# Frontend
cd student-frontend && npm test
```

## Build & Push to Registry

```bash
# Build images
docker build -t <registry>/student-backend:1.0 ./demo
docker build -t <registry>/student-frontend:1.0 ./student-frontend

# Push to registry
docker push <registry>/student-backend:1.0
docker push <registry>/student-frontend:1.0
```

## Useful Commands

```bash
# Maven
mvn clean package -DskipTests        # Build without tests
mvn dependency:tree                  # View dependencies
mvn versions:display-dependency-updates  # Check updates

# Docker
docker images                        # List images
docker ps -a                        # List containers
docker logs <container-id>          # View logs
docker exec -it <container-id> bash # Access container

# Kubernetes
kubectl get all                     # View all resources
kubectl delete -f k8s/              # Delete deployments
kubectl rollout status deployment/student-backend  # Check rollout
kubectl apply -f k8s/ --record      # Deploy with history
```

## CI/CD Workflow

1. **Commit Code** → Pushed to Git
2. **Jenkins Triggers** → Detects changes
3. **Build** → Maven builds JAR
4. **Test** → Maven runs tests
5. **Docker Build** → Creates Docker image
6. **Push** → Pushes to registry
7. **Deploy** → Kubernetes deploys to cluster

## Production Checklist

- [ ] Update H2 to production database (PostgreSQL/MySQL)
- [ ] Configure environment variables in K8s ConfigMaps
- [ ] Set up Secrets for sensitive data
- [ ] Configure Ingress for routing
- [ ] Set up monitoring and logging
- [ ] Configure auto-scaling policies
- [ ] Set up backup strategy
- [ ] Configure HTTPS/TLS
