"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Check, X, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import type { Quote } from "@/types/quote"
import { Quotes } from "@phosphor-icons/react";

export function QuoteCard() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("quotes")
    if (stored) {
      setQuotes(JSON.parse(stored))
    } else {
      // Default quote
      const defaultQuote: Quote = {
        id: "1",
        text: "One day, you'll see why Allah made you wait.",
        createdAt: Date.now(),
      }
      setQuotes([defaultQuote])
      localStorage.setItem("quotes", JSON.stringify([defaultQuote]))
    }
  }, [])

  useEffect(() => {
    if (quotes.length > 0) {
      localStorage.setItem("quotes", JSON.stringify(quotes))
    }
  }, [quotes])

  const currentQuote = quotes[currentIndex]

  const addQuote = () => {
    if (editText.trim()) {
      const newQuote: Quote = {
        id: Date.now().toString(),
        text: editText,
        createdAt: Date.now(),
      }
      setQuotes([...quotes, newQuote])
      setCurrentIndex(quotes.length)
      setIsAdding(false)
      setEditText("")
    }
  }

  const updateQuote = () => {
    if (editText.trim()) {
      setQuotes(quotes.map((q) => (q.id === currentQuote.id ? { ...q, text: editText } : q)))
      setIsEditing(false)
      setEditText("")
    }
  }

  const deleteQuote = () => {
    if (quotes.length > 1) {
      const newQuotes = quotes.filter((q) => q.id !== currentQuote.id)
      setQuotes(newQuotes)
      setCurrentIndex(Math.min(currentIndex, newQuotes.length - 1))
      setIsEditing(false)
    }
  }

  const startEdit = () => {
    setEditText(currentQuote.text)
    setIsEditing(true)
  }

  const startAdd = () => {
    setEditText("")
    setIsAdding(true)
  }

  const cancel = () => {
    setIsEditing(false)
    setIsAdding(false)
    setEditText("")
  }

  const previousQuote = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : quotes.length - 1))
  }

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev < quotes.length - 1 ? prev + 1 : 0))
  }

  if (quotes.length === 0) {
    return (
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-blue-200">
        <div className="text-center">
          <p className="text-blue-900 mb-4">No quotes yet</p>
          <Button onClick={startAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Quote
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-sm border-blue-200 relative">
      {isAdding ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-blue-900">Add New Quote</h3>
          <Textarea
            placeholder="Enter your quote here"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="bg-white/80 border-blue-200 min-h-[100px]"
            autoFocus
          />
          <div className="flex gap-2">
            <Button onClick={addQuote} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={cancel} variant="outline" className="flex-1 bg-transparent">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      ) : isEditing ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-blue-900">Edit Quote</h3>
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="bg-white/80 border-blue-200 min-h-[100px]"
            autoFocus
          />
          <div className="flex gap-2">
            <Button onClick={updateQuote} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={deleteQuote} variant="destructive" className="flex-1">
              Delete
            </Button>
            <Button onClick={cancel} variant="outline" className="flex-1 bg-transparent">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="h-8 w-8 flex items-center justify-center text-blue-900 text-xl">
              <Quotes
              size={30} 
              color="#486fa3" 
              weight="duotone" 
              />
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={startEdit}>
                <Pencil className="w-4 h-4 text-blue-900" />
              </Button>
              <Button size="icon" variant="ghost" onClick={startAdd}>
                <Plus className="w-4 h-4 text-blue-900" />
              </Button>
            </div>
          </div>

          <p className="text-blue-900 italic text-balance leading-relaxed mb-4">{currentQuote.text}</p>

          {quotes.length > 1 && (
            <div className="flex items-center justify-between">
              <Button size="icon" variant="ghost" onClick={previousQuote}>
                <ChevronLeft className="w-4 h-4 text-blue-900" />
              </Button>
              <span className="text-xs text-blue-900">
                {currentIndex + 1} / {quotes.length}
              </span>
              <Button size="icon" variant="ghost" onClick={nextQuote}>
                <ChevronRight className="w-4 h-4 text-blue-900" />
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
