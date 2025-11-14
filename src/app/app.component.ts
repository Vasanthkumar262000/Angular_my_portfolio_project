import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faJava, faLinkedin, faPython, faGithub, faJs, faReact, faSquareJs, faBootstrap, faUpwork, faGit, faHtml5} from '@fortawesome/free-brands-svg-icons';
import { faGlobe,faFilePdf,faHome, faDatabase, faServer, faCode, faUser, faArrowUp, faBriefcase, faFolder, faCertificate, faGraduationCap, faStar } from '@fortawesome/free-solid-svg-icons';
import { SplitTextComponent } from './components/split-text.component'; // <-- add this
import { HoverGlowDirective } from './components/hover-glow.direction';
import { RotatingTextComponent } from './components/rotating-text.component';

@Component({  
  selector: 'app-root',
  standalone: true, // Declare it as a standalone component
  imports: [CommonModule, FontAwesomeModule, RouterOutlet, SplitTextComponent, HoverGlowDirective, RotatingTextComponent], // Import necessary modules
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  title = 'my_portfolio_project';

  showAppContact = true;
  showskill = true;
  showContact = true;
  showexperiance = true;
  showeducation = true;
  showfavorites = true;
  showScrollTop = false; // Controls visibility of scroll-to-top button
  activeSection = 'App-contact'; // Tracks the currently active section in navigation
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

  constructor(library: FaIconLibrary) {
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
    library.addIcons(faBootstrap);
    library.addIcons(faDatabase);
    library.addIcons(faUpwork);
    library.addIcons(faGit);
    library.addIcons(faCode);
    library.addIcons(faHtml5);
    library.addIcons(faUser);
    library.addIcons(faArrowUp); // Add arrow up icon for scroll-to-top button
    library.addIcons(faBriefcase); // Briefcase icon for Work Experience
    library.addIcons(faFolder); // Folder icon for Projects
    library.addIcons(faCertificate); // Certificate icon for Certifications
    library.addIcons(faGraduationCap); // Graduation cap icon for Education
    library.addIcons(faStar); // Star icon for Favorites
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

  // Listens to window scroll events to show/hide scroll-to-top button and detect active section
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Show button when user scrolls down more than 300px
    this.showScrollTop = window.scrollY > 300;
    
    // Detect which section is currently in view
    this.detectActiveSection();
  }

  // Smoothly scrolls the page to the top when button is clicked
  scrollToTop(): void {
    window.scrollTo({
      top: 0,           // Scroll to top of page
      behavior: 'smooth' // Use smooth scrolling animation
    });
  }

  // Scrolls to a specific section smoothly
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Offset for better visibility
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  // Detects which section is currently in the viewport
  detectActiveSection(): void {
    const sections = ['App-contact', 'skill', 'experiance', 'projects', 'certifications', 'education', 'favorites'];
    const scrollPosition = window.scrollY + 150; // Offset to trigger active state earlier

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
    
    // If at the top, set App-contact as active
    if (window.scrollY < 100) {
      this.activeSection = 'App-contact';
    }
  }

  openCertification(link?: string): void {
    if (!link) { return; }
    window.open(link, '_blank', 'noopener');
  }
}