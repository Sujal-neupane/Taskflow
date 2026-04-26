terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

variable "github_username" { type = string }
variable "image_tag"       { type = string; default = "latest" }

variable "supabase_url"         { type = string; sensitive = true }
variable "supabase_service_key" { type = string; sensitive = true }
variable "supabase_jwt_secret"  { type = string; sensitive = true }

resource "docker_network" "taskflow" {
  name = "taskflow-net"
}

resource "docker_image" "backend" {
  name          = "ghcr.io/${var.Sujal-neupane}/taskflow-backend:${var.image_tag}"
  pull_triggers = [var.image_tag]
}

resource "docker_image" "frontend" {
  name          = "ghcr.io/${var.Sujal-neupane}/taskflow-frontend:${var.image_tag}"
  pull_triggers = [var.image_tag]
}

resource "docker_container" "backend" {
  name    = "taskflow-api"
  image   = docker_image.backend.image_id
  restart = "unless-stopped"

  ports {
    internal = 4000
    external = 4000
  }

  env = [
    "NODE_ENV=production",
    "PORT=4000",
    "SUPABASE_URL=${var.supabase_url}",
    "SUPABASE_SERVICE_KEY=${var.supabase_service_key}",
    "SUPABASE_JWT_SECRET=${var.supabase_jwt_secret}",
    "CORS_ORIGIN=http://localhost",
  ]

  networks_advanced {
    name = docker_network.taskflow.name
  }
}

resource "docker_container" "frontend" {
  name    = "taskflow-web"
  image   = docker_image.frontend.image_id
  restart = "unless-stopped"

  ports {
    internal = 80
    external = 80
  }

  networks_advanced {
    name = docker_network.taskflow.name
  }

  depends_on = [docker_container.backend]
}

output "app_url" { value = "http://localhost:80" }