import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatApiService, ChatResponse } from '../../services/chat-api.services';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  provider?: string;
  model?: string;
  isError?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesEnd', { static: false }) messagesEndRef!: ElementRef;
  @ViewChild('inputRef', { static: false }) inputRef!: ElementRef<HTMLInputElement>;

  isOpen = true;
  messages: Message[] = [
    {
      text: "Hi, I'm Vasanth's AI assistant. Ask me anything about his experience, skills, projects, or education",
      sender: 'bot',
      timestamp: new Date(),
    },
  ];
  inputMessage = '';
  isLoading = false;
  private shouldScrollToBottom = false;

  constructor(private chatApiService: ChatApiService) {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  scrollToBottom(): void {
    if (this.messagesEndRef) {
      this.messagesEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.inputRef) {
      setTimeout(() => {
        this.inputRef?.nativeElement?.focus();
      }, 100);
    }
  }

  async handleSendMessage(): Promise<void> {
    if (!this.inputMessage.trim() || this.isLoading) return;

    const userMessage: Message = {
      text: this.inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    this.messages.push(userMessage);
    const messageToSend = this.inputMessage;
    this.inputMessage = '';
    this.isLoading = true;
    this.shouldScrollToBottom = true;

    try {
      this.chatApiService.sendMessage(messageToSend).subscribe({
        next: (response: ChatResponse) => {
          const botMessage: Message = {
            text: response.response,
            sender: 'bot',
            timestamp: new Date(),
            provider: response.provider,
            model: response.model,
          };
          this.messages.push(botMessage);
          this.shouldScrollToBottom = true;
          this.isLoading = false;
        },
        error: (error: Error) => {
          const errorMessage: Message = {
            text: `Sorry, I encountered an error: ${error.message}. Please make sure the backend server is running.`,
            sender: 'bot',
            timestamp: new Date(),
            isError: true,
          };
          this.messages.push(errorMessage);
          this.shouldScrollToBottom = true;
          this.isLoading = false;
        }
      });
    } catch (error: any) {
      const errorMessage: Message = {
        text: `Sorry, I encountered an error: ${error.message || 'Unknown error'}. Please make sure the backend server is running.`,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      this.messages.push(errorMessage);
      this.shouldScrollToBottom = true;
      this.isLoading = false;
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSendMessage();
    }
  }

  clearChat(): void {
    this.messages = [
      {
        text: "Hi, I'm Vasanth's AI assistant. Ask me anything about his experience, skills, projects, or education",
        sender: 'bot',
        timestamp: new Date(),
      },
    ];
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString();
  }
}