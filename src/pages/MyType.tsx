import ProjectPage from '../components/ProjectPage/ProjectPage'
import FontCard from '../components/FontCard/FontCard'

function MyType() {
  return (
    <ProjectPage
      title="MyType"
      subtitle="Find your type"
      paragraphs={[
        'One of the most critical components of any creative project is the typeface. In many ways, it can make or break the overall design. It is often the first thing that catches the eye and sets the tone for the rest of the project. Whether it\'s a brand identity, a website, a poster, or a book, the typeface is the foundation of the design.',
        'To help facilitate the creative process, I built MyType, a tool that allows you to explore different typefaces efficiently and effectively. Using a font-identification AI model integrated right in your browser, you can take a snapshot of any image and it will identify the typeface used in the image, offering you a link to the font\'s download link.',
      ]}
      externalLink={{
        href: 'https://my-type.ai',
        text: 'Visit MyType',
      }}
      sidebarContent={<FontCard fontName="Helvetica" index={0} />}
    />
  )
}

export default MyType
