'use client'

import { useState, useCallback } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowRightLeft, Wallet, TrendingUp, BarChart2 } from 'lucide-react'

export function OnChainActionsPreview() {
  const [onChainState, setOnChainState] = useState({
    swapFrom: '',
    swapTo: '',
    transferRecipient: '',
    transferAmount: '',
    tokenAddress: ''
  })

  const updateOnChainState = useCallback((updates: Partial<typeof onChainState>) => {
    setOnChainState(prev => ({ ...prev, ...updates }))
  }, [])

  return (
    <Card className="w-full bg-black border border-[#e8f9ff]/30 p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-mono text-[#e8f9ff]">OnChain Actions</h2>
        <p className="text-sm text-white/70">
          Execute Solana blockchain operations with advanced features and real-time market data.
        </p>
      </div>

      <div className="opacity-50 pointer-events-none">
        <Tabs defaultValue="swap" className="w-full">
          <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
            <TabsTrigger 
              value="swap"
              className="bg-black text-white border border-[#e8f9ff]/30 data-[state=active]:bg-[#e8f9ff]/20 data-[state=active]:text-[#e8f9ff]"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Swap
            </TabsTrigger>
            <TabsTrigger 
              value="transfer"
              className="bg-black text-white border border-[#e8f9ff]/30 data-[state=active]:bg-[#e8f9ff]/20 data-[state=active]:text-[#e8f9ff]"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Transfer
            </TabsTrigger>
            <TabsTrigger 
              value="price"
              className="bg-black text-white border border-[#e8f9ff]/30 data-[state=active]:bg-[#e8f9ff]/20 data-[state=active]:text-[#e8f9ff]"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Price
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="bg-black text-white border border-[#e8f9ff]/30 data-[state=active]:bg-[#e8f9ff]/20 data-[state=active]:text-[#e8f9ff]"
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="swap" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-white">From</label>
                  <Input 
                    disabled
                    placeholder="Enter amount"
                    className="bg-black border-[#e8f9ff]/30 text-white"
                    value={onChainState.swapFrom}
                    onChange={(e) => updateOnChainState({ swapFrom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white">To</label>
                  <Input 
                    disabled
                    placeholder="Enter amount"
                    className="bg-black border-[#e8f9ff]/30 text-white"
                    value={onChainState.swapTo}
                    onChange={(e) => updateOnChainState({ swapTo: e.target.value })}
                  />
                </div>
                <Button disabled className="w-full bg-[#e8f9ff]/20 text-[#e8f9ff] hover:bg-[#e8f9ff]/30">
                  Swap Tokens
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="transfer" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-white">Recipient Address</label>
                  <Input 
                    disabled
                    placeholder="Enter Solana address"
                    className="bg-black border-[#e8f9ff]/30 text-white"
                    value={onChainState.transferRecipient}
                    onChange={(e) => updateOnChainState({ transferRecipient: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white">Amount</label>
                  <Input 
                    disabled
                    placeholder="Enter amount"
                    className="bg-black border-[#e8f9ff]/30 text-white"
                    value={onChainState.transferAmount}
                    onChange={(e) => updateOnChainState({ transferAmount: e.target.value })}
                  />
                </div>
                <Button disabled className="w-full bg-[#e8f9ff]/20 text-[#e8f9ff] hover:bg-[#e8f9ff]/30">
                  Send Transaction
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="price" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-white">Token Address</label>
                  <Input 
                    disabled
                    placeholder="Enter token address"
                    className="bg-black border-[#e8f9ff]/30 text-white"
                    value={onChainState.tokenAddress}
                    onChange={(e) => updateOnChainState({ tokenAddress: e.target.value })}
                  />
                </div>
                <Button disabled className="w-full bg-[#e8f9ff]/20 text-[#e8f9ff] hover:bg-[#e8f9ff]/30">
                  Get Price Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-white">Token Address</label>
                  <Input 
                    disabled
                    placeholder="Enter token address"
                    className="bg-black border-[#e8f9ff]/30 text-white"
                    value={onChainState.tokenAddress}
                    onChange={(e) => updateOnChainState({ tokenAddress: e.target.value })}
                  />
                </div>
                <Button disabled className="w-full bg-[#e8f9ff]/20 text-[#e8f9ff] hover:bg-[#e8f9ff]/30">
                  View Analytics
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4 text-yellow-200/90 flex items-start gap-2">
        <AlertCircle className="w-5 h-5 mt-0.5" />
        <div className="text-sm">
          Cannot yet access this feature. Please hold a minimum of 10M tokens to unlock this functionality.
        </div>
      </div>
    </Card>
  )
}

