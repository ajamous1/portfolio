import ProjectPage from '../components/ProjectPage/ProjectPage'
// import BasketballGame from '../components/BasketballGame/BasketballGame' // Temporarily hidden

function NBAGamedayGenerator() {
  return (
    <ProjectPage
      title="NBA Gameday Generator"
      subtitle="Generating high-quality posters using web scraping and Photoshop APIs"
      paragraphs={[
        'The NBA Gameday Generator automates the creation of high-quality game day posters by combining web scraping techniques with Adobe Photoshop\'s REST API. The system fetches real-time game data, team information, and statistics to generate professional-quality visual content.',
        'Built with Python, Selenium, BeautifulSoup, and the Photoshop API, this project demonstrates automation in creative workflows. It extracts team colors, logos, and game statistics, then programmatically generates layered PSD files with dynamic content.',
      ]}
      externalLinks={[
        {
          href: 'https://github.com/ajamous1/NBA-Gameday-Generator',
          text: 'View on GitHub',
          variant: 'primary',
        },
        {
          href: 'https://www.linkedin.com/posts/ajamous1_automated-nba-poster-generator-using-nba-activity-7184568952373575681-pnie?utm_source=share&utm_medium=member_desktop&rcm=ACoAADjjcnsBv1vRdHERc6NeMuM0sZUCXmV80HA',
          text: 'Watch Demo',
          variant: 'secondary',
        },
      ]}
      // sidebarContent={<BasketballGame />} // Temporarily hidden
    />
  )
}

export default NBAGamedayGenerator
