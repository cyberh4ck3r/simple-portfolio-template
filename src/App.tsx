import React, { useState, useEffect } from 'react'
import yaml from 'js-yaml'

interface SocialButton {
  name: string
  url: string
  icon: string
}

interface Project {
  icon: string
  title: string
  description: string
  period: string
  url: string
}

interface Config {
  ICON_FORMAT: string
  GOOGLE_FONT: string
  NAME: string
  ABOUT_ME_CONTENT: string
  ABOUT_ME_ALIGN: string
  SOCIALS_CONTENT: string
  SOCIALS_ALIGN: string
  SOCIAL_BUTTONS: SocialButton[]
  PROJECTS: Project[]
}

function App() {
  const [iconFormat, setIconFormat] = useState('png')
  const [googleFont, setGoogleFont] = useState('Inter')
  const [name, setName] = useState('Ben')
  const [config, setConfig] = useState<Config | null>(null)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [modalContent, setModalContent] = useState<string | null>(null)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/config/config.yml')
        const yamlText = await response.text()
        const config = yaml.load(yamlText) as Config
        setIconFormat(config.ICON_FORMAT.toLowerCase())
        setGoogleFont(config.GOOGLE_FONT || 'Inter')
        setName(config.NAME || 'Ben')
        setConfig(config)
        
        // Load Google Font
        const fontName = config.GOOGLE_FONT || 'Inter'
        const link = document.createElement('link')
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`
        link.rel = 'stylesheet'
        document.head.appendChild(link)
        
        // Apply font to body
        document.body.style.fontFamily = `'${fontName}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
        
        // Update page title
        document.title = `${config.NAME || 'Ben'}'s Website`
      } catch (error) {
        console.error('Error loading config:', error)
        setIconFormat('png')
        setGoogleFont('Inter')
      }
    }

    loadConfig()
  }, [])

  const handleCloseModal = () => {
    if (isClosing) return // Prevent multiple close calls
    setIsClosing(true)
    setTimeout(() => {
      setActiveModal(null)
      setModalContent(null)
      setIsClosing(false)
    }, 280)
  }

  return (
    <div className="container">
      <div className="profile-circle">
        <img 
          id="usericon" 
          src={`/config/usericon.${iconFormat}`} 
          alt="User Icon" 
        />
      </div>
      <h1>Hi, I'm {name}.</h1>
      <p>Welcome to my website!</p>
      <div className="divider"></div>
      <nav>
        <button onClick={() => { 
          if (!isClosing) { 
            setActiveModal('about'); 
            setModalContent('about'); 
          } 
        }}>ABOUT ME</button>
        <button onClick={() => { 
          if (!isClosing) { 
            setActiveModal('socials'); 
            setModalContent('socials'); 
          } 
        }}>SOCIALS</button>
        <button onClick={() => { 
          if (!isClosing) { 
            setActiveModal('projects'); 
            setModalContent('projects'); 
          } 
        }}>PROJECTS</button>
      </nav>
      
      {(activeModal || isClosing) && config && (
        <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={() => !isClosing && handleCloseModal()}>
          <div className={`modal-content ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalContent === 'about' && 'About Me'}
                {modalContent === 'socials' && 'Socials'}
                {modalContent === 'projects' && 'Projects'}
              </h2>
              <button className="modal-close" onClick={() => !isClosing && handleCloseModal()}>×</button>
            </div>
            <div className="modal-body">
              {modalContent === 'socials' ? (
                <div style={{ textAlign: config.SOCIALS_ALIGN as any }}>
                  <p className="socials-text">{config.SOCIALS_CONTENT}</p>
                  <div className="social-buttons">
                    {config.SOCIAL_BUTTONS?.slice(0, 5).map((social, index) => (
                      <a 
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-button"
                        title={social.name}
                      >
                        {social.icon.startsWith('http') ? (
                          <img 
                            src={social.icon} 
                            alt={social.name}
                            className="social-icon-img"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling!.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <span 
                          className="social-icon" 
                          style={{ 
                            display: social.icon.startsWith('http') ? 'none' : 'block' 
                          }}
                        >
                          {social.icon.startsWith('http') ? social.name.charAt(0) : social.icon}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : modalContent === 'projects' ? (
                <div className="projects-container">
                  {config.PROJECTS?.slice(0, 5).map((project, index) => (
                    <div key={index} className="project-item">
                      <div className="project-icon">
                        {project.icon.startsWith('http') ? (
                          <img 
                            src={project.icon} 
                            alt={project.title}
                            className="project-icon-img"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling!.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <span 
                          className="project-icon-text" 
                          style={{ 
                            display: project.icon.startsWith('http') ? 'none' : 'block' 
                          }}
                        >
                          {project.icon.startsWith('http') ? project.title.charAt(0) : project.icon}
                        </span>
                      </div>
                      <div className="project-content">
                        <div className="project-header">
                          <h3 className="project-title">{project.title}</h3>
                          <div className="project-period-badge">
                            <svg className="period-clock" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="period-text">{project.period}</span>
                          </div>
                        </div>
                        <p className="project-description">{project.description}</p>
                      </div>
                      <a 
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        title="Open project"
                      >
                        <svg className="external-link-icon" viewBox="0 0 24 24" fill="none">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <pre style={{
                  textAlign: config.ABOUT_ME_ALIGN as any
                }}>
                  {modalContent === 'about' && config.ABOUT_ME_CONTENT}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App