"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { BookOpen, Save, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { JournalEntry } from "@/types/journal"

export function DailyJournal() {
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isSaved, setIsSaved] = useState(false)

    const dateString = currentDate.toISOString().split("T")[0]

    useEffect(() => {
        const saved = localStorage.getItem("journal")
        if (saved) {
        setEntries(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        const entry = entries.find((e) => e.date === dateString)
        if (entry) {
        setTitle(entry.title)
        setContent(entry.content)
        setIsSaved(true)
        } else {
        setTitle("")
        setContent("")
        setIsSaved(false)
        }
    }, [dateString, entries])

    const saveEntry = () => {
        if (!title.trim() && !content.trim()) return

        const entry: JournalEntry = {
        id: Date.now().toString(),
        date: dateString,
        title: title,
        content: content,
        tags: [],
        createdAt: new Date().toISOString(),
        }

        const updatedEntries = entries.filter((e) => e.date !== dateString)
        updatedEntries.push(entry)
        setEntries(updatedEntries)
        localStorage.setItem("journal", JSON.stringify(updatedEntries))
        setIsSaved(true)

        // Show save confirmation
        setTimeout(() => setIsSaved(false), 2000)
    }

    const deleteEntry = () => {
        const updatedEntries = entries.filter((e) => e.date !== dateString)
        setEntries(updatedEntries)
        localStorage.setItem("journal", JSON.stringify(updatedEntries))
        setTitle("")
        setContent("")
    }

    const goToPreviousDay = () => {
        const newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() - 1)
        setCurrentDate(newDate)
    }

    const goToNextDay = () => {
        const newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() + 1)
        setCurrentDate(newDate)
    }

    const goToToday = () => {
        setCurrentDate(new Date())
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        })
    }

    const hasEntry = entries.some((e) => e.date === dateString)
    const isToday = dateString === new Date().toISOString().split("T")[0]

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-900" />
            <h3 className="text-xl font-bold text-blue-900">Daily Journal</h3>
            </div>
            {hasEntry && (
            <Button onClick={deleteEntry} size="sm" variant="ghost" className="text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
            </Button>
            )}
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
            <Button onClick={goToPreviousDay} size="sm" variant="ghost" className="text-primary">
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-center flex-1">
                <div className="font-semibold text-foreground">{formatDate(currentDate)}</div>
                {!isToday && (
                <Button onClick={goToToday} size="sm" variant="link" className="text-xs text-primary">
                    Back to today
                </Button>
                )}
            </div>
            <Button onClick={goToNextDay} size="sm" variant="ghost" className="text-primary" disabled={isToday}>
                <ChevronRight className="h-5 w-5" />
            </Button>
            </div>

            <Input
            placeholder="Entry title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-primary/30 bg-white font-semibold"
            />

            <Textarea
            placeholder="What's on your mind today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none border-primary/30 bg-white min-h-[200px]"
            rows={8}
            />

            <div className="flex gap-2">
            <Button
                onClick={saveEntry}
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                disabled={!title.trim() && !content.trim()}
            >
                <Save className="mr-2 h-4 w-4" />
                {isSaved ? "Saved!" : "Save Entry"}
            </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
            {entries.length} journal {entries.length === 1 ? "entry" : "entries"} total
            </div>
        </div>
        </Card>
    )
}
