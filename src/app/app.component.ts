import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faJava, faLinkedin, faPython, faGithub, faJs, faReact, faSquareJs, faBootstrap, faUpwork, faGit, faHtml5} from '@fortawesome/free-brands-svg-icons';
import { faGlobe,faFilePdf,faHome, faDatabase, faServer, faCode, faUser, faArrowUp, faBriefcase, faFolder, faCertificate, faGraduationCap, faStar,} from '@fortawesome/free-solid-svg-icons';
import { SplitTextComponent } from './components/split-text.component'; 
import { HoverGlowDirective } from './components/hover-glow.direction';
import { RotatingTextComponent } from './components/rotating-text.component';
import { ChatbotComponent } from './components/chatbot.component';

@Component({  
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterOutlet, SplitTextComponent, HoverGlowDirective, RotatingTextComponent, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title = 'my_portfolio_project';

  showAppContact = true;
  showskill = true;
  showContact = true;
  showexperiance = true;
  showeducation = true;
  showfavorites = true;
  showScrollTop = false; 
  activeSection = 'App-contact'; 
  isMobile = false; 

  projects = [
    {
      id: 'project-1',
      title: 'Project Demo',
      description: 'Watch the full project demonstration on YouTube',
      youtubeUrl: 'https://www.youtube.com/watch?v=P3RNge_golM'
    }
  ];

  certifications = [
    {
      id: 'cert-1',
      title: 'AWS Certified AI Practitioner',
      issuer: 'Amazon Web Services',
      image: '/certificates/cert1.png',
      link: 'https://www.credly.com/badges/fb6e256c-97a7-40b4-9e47-438ba8a78cb6/public_url'
    },
    {
      id: 'cert-2',
      title: 'AWS Machine Learning Engineer - Associate',
      issuer: 'Amazon Web Services',
      image: '/certificates/cert2.png',
      link: 'https://www.credly.com/earner/earned/badge/7d785f20-281e-4182-9e88-d04df1a3e48c'
    },
    {
      id: 'cert-3',
      title: 'Microsoft Certified: Python Developer',
      issuer: 'Microsoft',
      image: '/certificates/cert3.png',
      link: 'https://www.coursera.org/account/accomplishments/professional-cert/OGTX4B32ESIG'
    },
    {
      id: 'cert-4',
      title: 'Google AI Essentials',
      issuer: 'Google',
      image: '/certificates/cert4.png',
      link: 'https://www.coursera.org/account/accomplishments/specialization/0UZ2X9F8ODSQ'
    },
    {
      id: 'cert-5',
      title: 'IBM Genrative AI Application Developer',
      issuer: 'IBM',
      image: '/certificates/cert5.png',
      link: 'https://www.coursera.org/account/accomplishments/verify/HFR5R9VULWVP'
    },
    {
      id: 'cert-6',
      title: 'Programming Fundamentals with JavaScript, HTML and CSS',
      issuer: 'Duke',
      image: '/certificates/cert6.png',
      link: 'https://www.coursera.org/account/accomplishments/certificate/HFR5R9VULWVP'
    }
  ];

  constructor(library: FaIconLibrary, private sanitizer: DomSanitizer) {
    library.addIcons(faLinkedin);
    library.addIcons(faGithub);
    library.addIcons(faGlobe);
    library.addIcons(faHome);
    library.addIcons(faFilePdf);
    library.addIcons(faPython);
    library.addIcons(faJava);
    library.addIcons(faJs);
    library.addIcons(faReact);
    library.addIcons(faSquareJs);

    this.checkMobile();
    library.addIcons(faBootstrap);
    library.addIcons(faDatabase);
    library.addIcons(faUpwork);
    library.addIcons(faGit);
    library.addIcons(faCode);
    library.addIcons(faHtml5);
    library.addIcons(faUser);
    library.addIcons(faArrowUp); 
    library.addIcons(faBriefcase); 
    library.addIcons(faFolder); 
    library.addIcons(faCertificate); 
    library.addIcons(faGraduationCap); 
    library.addIcons(faStar); 

    this.checkMobile();
  }

  checkMobile(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  getProfileNameAlign(): 'left' | 'center' {
    return this.isMobile ? 'center' : 'left';
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobile();
  }

 toggleSection(section: string) {
    switch (section) {
      case 'App-contact':
        this.showAppContact = !this.showAppContact;
        break;
      case 'skill':
        this.showskill = !this.showskill;
        break;
      case 'experiance':
        this.showexperiance = !this.showexperiance;
        break;
      case 'education':
        this.showeducation = !this.showeducation;
        break;
      case 'favorites':
        this.showfavorites = !this.showfavorites;
        break;

    }
  }
    handleAnimationComplete() {
    console.log('All letters have animated!');
  }


  @HostListener('window:scroll', [])
  onWindowScroll(): void {

    this.showScrollTop = window.scrollY > 300;

    this.detectActiveSection();
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,           
      behavior: 'smooth' 
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; 
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  detectActiveSection(): void {
    const sections = ['App-contact', 'skill', 'experiance', 'projects', 'certifications', 'education', 'favorites'];
    const scrollPosition = window.scrollY + 150;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          this.activeSection = sections[i];
          return;
        }
      }
    }

    if (window.scrollY < 100) {
      this.activeSection = 'App-contact';
    }
  }

  openCertification(link?: string): void {
    if (!link) { return; }
    window.open(link, '_blank', 'noopener');
  }

  getEmbedUrl(youtubeUrl: string): SafeResourceUrl {
    const videoId = this.extractVideoId(youtubeUrl);
    if (!videoId) {
      console.error('Could not extract video ID from URL:', youtubeUrl);
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    // Add additional parameters for better compatibility
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
    console.log('Video ID extracted:', videoId);
    console.log('Embed URL generated:', embedUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractVideoId(url: string): string {
    if (!url) return '';
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^#&?]*)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        const videoId = match[1];
        // YouTube video IDs are always 11 characters
        if (videoId.length === 11) {
          return videoId;
        }
      }
    }
    
    return '';
  }

  openProject(youtubeUrl?: string): void {
    if (!youtubeUrl) { return; }
    window.open(youtubeUrl, '_blank', 'noopener');
  }

  handleVideoError(event: any, project: any): void {
    console.error('Video loading error for project:', project.title, event);
  }
}