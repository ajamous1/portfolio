import { Link } from 'react-router-dom'
import { ReactNode } from 'react'
import '../../App.css'

export interface ProjectPageProps {
  title: string
  subtitle: string
  paragraphs: string[]
  externalLink?: {
    href: string
    text: string
    variant?: 'primary' | 'secondary'
  }
  externalLinks?: Array<{
    href: string
    text: string
    variant?: 'primary' | 'secondary'
  }>
  sidebarContent?: ReactNode
}

function ProjectPage({
  title,
  subtitle,
  paragraphs,
  externalLink,
  externalLinks,
  sidebarContent,
}: ProjectPageProps) {
  // Use externalLinks array if provided, otherwise fall back to single externalLink
  const links = externalLinks || (externalLink ? [externalLink] : [])

  return (
    <div className="portfolio">
      <header className="portfolio-header portfolio-header-left">
        <Link to="/" className="back-link">← Back</Link>
        <h1 className="portfolio-name">{title}</h1>
      </header>

      <main className="portfolio-content">
        <section className="portfolio-section">
          <div className={sidebarContent ? 'project-layout' : ''}>
            <div className="project-detail-card">
              <h2 className="section-title">{subtitle}</h2>
              <div className="project-detail-content">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="section-text">
                    {paragraph}
                  </p>
                ))}
                {links.length > 0 && (
                  <div className="project-link-container">
                    {links.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`external-link ${link.variant === 'secondary' ? 'external-link-secondary' : ''}`}
                      >
                        {link.text} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {sidebarContent && (
              <div className="project-sidebar">
                {sidebarContent}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default ProjectPage
