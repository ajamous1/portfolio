import { Link } from 'react-router-dom'
import { useMode } from '../contexts/ModeContext'
import '../App.css'

interface Project {
  title: string
  description: string
  route?: string
  url?: string
  thumbnail?: string
}

function Home() {
  const { isDeveloper } = useMode()

  const modeTitle = isDeveloper ? 'Developer' : 'Designer'

  const developerProjects: Project[] = [
    {
      title: 'MyType',
      description: 'Redefining the creative process through typography.',
      route: '/mytype',
      thumbnail: '/images/mytype-thumbnail.png',
    },
    {
      title: 'NBA Gameday Generator',
      description: 'Generating high-quality posters using web scraping and Photoshop APIs.',
      route: '/nba-gameday-generator',
      thumbnail: '/images/nba-gameday-generator-thumbnail.png',
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
    },
    {
      title: 'Illustrations',
      description: 'Custom illustrations and artwork.',
      route: '/illustrations',
    },
    {
      title: 'Motion Graphics',
      description: 'Animated graphics and motion design.',
      route: '/motion-graphics',
    },
    {
      title: 'Videos',
      description: 'Video production and editing.',
      route: '/videos',
    },
    {
      title: 'Logos & Brands',
      description: 'Logo design and brand identity work.',
      route: '/logos-brands',
    },
    {
      title: 'Misc',
      description: 'Various design projects and experiments.',
      route: '/misc',
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
            {projects.map((project, index) => {
              const ProjectContent = (
                <>
                  {project.thumbnail && (
                    <div className="project-thumbnail">
                      <img src={project.thumbnail} alt={project.title} />
                    </div>
                  )}
                  <h3 className="project-title">{project.title}</h3>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                </>
              )

              if (project.route) {
                return (
                  <Link
                    key={index}
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
                    key={index}
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
                <div key={index} className="project-card">
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
