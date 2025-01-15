'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { TerminalIcon, X, Send, Mic, Loader2 } from 'lucide-react'
import { useChat } from 'ai/react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Keypair } from '@solana/web3.js'
import { getTokenProfile, getTokenOrders, getPairInfo } from '../utils/dexscreener'
import { checkTwitterUsername } from '@/utils/twitter'
import { BundlerPreview } from '@/components/bundler-preview'
import { OnChainActionsPreview } from '@/components/onchain-actions-preview'
import { VolumeBotPreview } from './volume-bot-preview'
import { PreviewModal } from './preview-modal'

const WELCOME_MESSAGE = `Welcome to Morpholution AI Terminal!
Type !help for a list of available commands.`

const HELP_MESSAGE = `Available commands:
!token_profile [address] - Get token profile
!token_orders [chainId] [address] - Get token orders
!pair_info [chainId] [pairId] - Get pair information
!twitter_check [username] - Check Twitter username history
!gen_wallet - Generate a new SOL wallet
!socials - Get our social media links
!help - Show this help message

For any other queries, just type your question and I'll assist you.`

interface TerminalProps {
  onClose: () => void
}

export default function Terminal({ onClose }: TerminalProps) {
  const { toast } = useToast()
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false)
  const [showBundler, setShowBundler] = useState(false)
  const [showOnChain, setShowOnChain] = useState(false)
  const [showVolumeBot, setShowVolumeBot] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const { messages, input, handleInputChange, handleSubmit, setMessages, setInput } = useChat({
    api: '/api/chat',
    initialMessages: [{ role: 'assistant', content: WELCOME_MESSAGE }]
  })

  const handleCommand = useCallback(async (command: string) => {
    const [cmd, ...args] = command.toLowerCase().trim().split(' ')
    
    switch (cmd) {
      case '!help':
        return HELP_MESSAGE
      case '!token_profile':
        if (args.length === 0) {
          return 'Please provide a token address'
        } else {
          try {
            const profile = await getTokenProfile(args[0])
            return profile
          } catch (error) {
            console.error('Error fetching token profile:', error)
            return 'Error fetching token profile. Please try again.'
          }
        }
      case '!token_orders':
        if (args.length < 2) {
          return 'Please provide chainId and token address'
        } else {
          try {
            const orders = await getTokenOrders(args[0], args[1])
            return orders
          } catch (error) {
            console.error('Error fetching token orders:', error)
            return 'Error fetching token orders. Please try again.'
          }
        }
      case '!pair_info':
        if (args.length < 2) {
          return 'Please provide chainId and pairId'
        } else {
          try {
            const pairInfo = await getPairInfo(args[0], args[1])
            return pairInfo
          } catch (error) {
            console.error('Error fetching pair info:', error)
            return 'Error fetching pair info. Please try again.'
          }
        }
      case '!twitter_check':
        if (args.length === 0) {
          return 'Please provide a Twitter username'
        } else {
          try {
            const twitterInfo = await checkTwitterUsername(args[0])
            return twitterInfo.formattedData || twitterInfo.error || 'No information found for this username.'
          } catch (error) {
            console.error('Error checking Twitter username:', error)
            return 'Error checking Twitter username. Please try again.'
          }
        }
      case '!gen_wallet':
        try {
          const newWallet = Keypair.generate()
          const publicKey = newWallet.publicKey.toString()
          const privateKey = Buffer.from(newWallet.secretKey).toString('hex')
          return `New wallet generated:
Public Key: ${publicKey}
Private Key: ${privateKey}
IMPORTANT: Save your private key securely. It will not be shown again.`
        } catch (error) {
          console.error('Error generating wallet:', error)
          return 'Error generating wallet. Please try again.'
        }
      case '!socials':
        return 'Our X is: https://x.com/Morpholution'
      default:
        return null
    }
  }, [])

  const handleSend = useCallback(async (text: string) => {
    if (text.trim()) {
      const commandResponse = await handleCommand(text)
      if (commandResponse) {
        setMessages(prevMessages => [
          ...prevMessages,
          { role: 'user', content: text },
          { role: 'assistant', content: commandResponse }
        ])
      } else {
        handleSubmit(undefined as any, {
          options: {
            body: {
              messages: [
                ...messages,
                { role: 'user', content: text }
              ]
            }
          }
        })
      }
      setInput('') // Reset the input field after sending
    }
  }, [handleCommand, setMessages, handleSubmit, messages, setInput])

  const startRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      })
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false

    recognitionRef.current.onstart = () => {
      setIsRecording(true)
    }

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      handleSend(transcript)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error)
      setIsRecording(false)
      toast({
        title: "Speech Recognition Error",
        description: "An error occurred while trying to recognize speech.",
        variant: "destructive",
      })
    }

    recognitionRef.current.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current.start()
  }, [toast, handleSend])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isVisible) {
      const speech = new SpeechSynthesisUtterance(WELCOME_MESSAGE);
      speech.lang = 'en-GB';
      speech.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Female') || null;
      window.speechSynthesis.speak(speech);
    }
  }, [isVisible]);

  return (
    <div className={`
      relative z-10 w-full max-w-3xl pointer-events-auto
      shadow-2xl transition-all duration-1000 ease-in-out overflow-hidden rounded-lg
      ${isMinimized ? 'h-16' : 'h-[80vh]'}
      ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
    `}>
      {/* Neural Network Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-pulse-slow">
          <div className="relative w-full h-full">
            <Image
              src="https://images.squarespace-cdn.com/content/v1/5d0ade01fc40e30001b4a6c5/1716306380932-PVU7SZ3J86W2YH3603SC/blue+spiral.gif?format=1000w"
              alt=""
              fill
              sizes="100vw"
              className="object-cover animate-scale"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
      </div>

      {/* Terminal Content */}
      <div className="relative flex flex-col h-full">
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-5 h-5" />
            <span className="font-mono text-sm">MORPHOLUTION_AI v1.0.0</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:text-white/70 transition-colors"
              aria-label={isMinimized ? "Maximize terminal" : "Minimize terminal"}
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="hover:text-white/70 transition-colors"
              aria-label="Close terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Terminal Messages */}
        <div className={`
          flex-grow overflow-y-auto p-4 select-text
          transition-all duration-500
          ${isMinimized ? 'opacity-0' : 'opacity-100'}
        `}>
          {messages.map((message, i) => (
            <div
              key={i}
              className={`mb-4 font-mono text-sm ${
                message.role === 'user' ? 'text-[#e8f9ff]' : 'text-white/90'
              }`}
            >
              <span className="opacity-50">{message.role === 'user' ? '>' : '#'}</span> {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className={`
          p-6 border-t border-white/10 bg-black/50
          transition-all duration-500
          ${isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}>
          <div className="flex items-center gap-2 relative">
            <span className="text-[#e8f9ff] font-mono absolute left-2 top-4">{'>'}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onFocus={() => setIsInputExpanded(true)}
              onBlur={() => setIsInputExpanded(false)}
              placeholder="Enter your command..."
              className={`w-full bg-transparent border-none outline-none font-mono text-sm text-white/90 placeholder:text-white/30 pl-6 transition-all duration-300 ${
                isInputExpanded ? 'h-32 py-3' : 'h-16 py-2'
              }`}
              aria-label="Chat input"
            />
            <Button type="submit" size="icon" className="absolute right-2 top-4">
              <Send className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              className={`absolute right-12 top-4 ${isRecording ? 'text-red-500' : 'text-white/70'}`}
            >
              {isRecording ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </div>

      <PreviewModal isOpen={showBundler} onClose={() => setShowBundler(false)}>
        <BundlerPreview />
      </PreviewModal>
      <PreviewModal isOpen={showOnChain} onClose={() => setShowOnChain(false)}>
        <OnChainActionsPreview />
      </PreviewModal>
      <PreviewModal isOpen={showVolumeBot} onClose={() => setShowVolumeBot(false)}>
        <VolumeBotPreview />
      </PreviewModal>
    </div>
  )
}

