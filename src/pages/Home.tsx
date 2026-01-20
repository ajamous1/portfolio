import { Link } from 'react-router-dom'
import { useMode } from '../contexts/ModeContext'
import ThumbnailImage from '../components/ThumbnailImage/ThumbnailImage'
import '../App.css'

interface Project {
  title: string
  description: string
  route?: string
  url?: string
  thumbnail?: string // Base path without extension, e.g., '/images/graphics-thumbnail'
}

function Home() {
  const { isDeveloper } = useMode()

  const modeTitle = isDeveloper ? 'Developer' : 'Designer'

  const developerProjects: Project[] = [
    {
      title: 'MyType',
      description: 'Redefining the creative process through typography.',
      route: '/mytype',
      thumbnail: '/images/mytype-thumbnail',
    },
    {
      title: 'NBA Gameday Generator',
      description: 'Generating high-quality posters using web scraping and Photoshop APIs.',
      route: '/nba-gameday-generator',
      thumbnail: '/images/nba-gameday-generator-thumbnail',
    },
    {
      title: 'Tiny Canvas',
      description: 'MS Paint-style drawing tool on a chip using Tiny Tapeout.',
      route: '/tiny-canvas',
    },
    {
      title: 'Coming Soon',
      description: 'Stay tuned for upcoming projects!',
    },
  ]

  const designerProjects: Project[] = [
    {
      title: 'Graphics',
      description: 'Visual design and graphic work.',
      route: '/graphics',
      thumbnail: '/images/graphics-thumbnail',
    },
    {
      title: 'Illustrations',
      description: 'Custom illustrations and artwork.',
      route: '/illustrations',
      thumbnail: '/images/illustrations-thumbnail',
    },
    {
      title: 'Motion Graphics',
      description: 'Animated graphics and motion design.',
      route: '/motion-graphics',
      thumbnail: '/images/motion-graphics-thumbnail',
    },
    {
      title: 'Videos',
      description: 'Video production and editing.',
      route: '/videos',
      thumbnail: '/images/videos-thumbnail',
    },
    {
      title: 'Logos & Brands',
      description: 'Logo design and brand identity work.',
      route: '/logos-brands',
      thumbnail: '/images/logos-and-brands-thumbnail',
    },
    {
      title: 'Misc',
      description: 'Various design projects and experiments.',
      route: '/misc',
      thumbnail: '/images/misc-thumbnail',
    },
  ]

  const projects = isDeveloper ? developerProjects : designerProjects

  return (
    <div className="portfolio">
      <header className="portfolio-header">
        <h1 className="portfolio-name">
          Ahmad Jamous is a {modeTitle}<br />
          based in Toronto, Canada
        </h1>
      </header>

      <main className="portfolio-content">
        <section className="portfolio-section">
          <div className="projects-grid">
            {projects.map((project) => {
              const ProjectContent = (
                <>
                  {project.thumbnail && (
                    <ThumbnailImage 
                      basePath={project.thumbnail} 
                      alt={project.title}
                      className={
                        project.title === 'Motion Graphics' 
                          ? 'motion-graphics-thumbnail' 
                          : project.title === 'Misc' 
                          ? 'misc-thumbnail' 
                          : ''
                      }
                    />
                  )}
                  <h3 className="project-title">{project.title}</h3>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                </>
              )

              // Use a stable key based on project title and mode
              const projectKey = `${isDeveloper ? 'dev' : 'design'}-${project.title}`

              if (project.route) {
                return (
                  <Link
                    key={projectKey}
                    to={project.route}
                    className="project-card project-card-link"
                  >
                    {ProjectContent}
                  </Link>
                )
              }

              if (project.url) {
                return (
                  <a
                    key={projectKey}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card project-card-link"
                  >
                    {ProjectContent}
                  </a>
                )
              }

              return (
                <div key={projectKey} className="project-card">
                  {ProjectContent}
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
