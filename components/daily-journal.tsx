"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    } from "@/components/ui/dialog"
    import {
    BookOpen,
    Save,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    Edit2,
    Calendar,
    Tag,
    FileText,
    Plus,
    } from "lucide-react"
    import type { JournalEntry } from "@/types/journal"
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
    import { ScrollArea } from "@/components/ui/scroll-area"

    export function DailyJournal() {
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const [isSaved, setIsSaved] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("write")

    const dateString = currentDate.toISOString().split("T")[0]

    useEffect(() => {
        const saved = localStorage.getItem("journal")
        if (saved) {
        setEntries(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        const entry = entries.find((e) => e.date === dateString)
        if (entry && !editingEntry) {
        setTitle(entry.title)
        setContent(entry.content)
        setTags(entry.tags || [])
        setIsSaved(true)
        } else if (!editingEntry) {
        setTitle("")
        setContent("")
        setTags([])
        setIsSaved(false)
        }
    }, [dateString, entries, editingEntry])

    const filteredEntries = useMemo(() => {
        return entries
        .filter((entry) => {
            const matchesSearch =
            searchQuery === "" ||
            entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesTag = !selectedTag || entry.tags.includes(selectedTag)
            return matchesSearch && matchesTag
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [entries, searchQuery, selectedTag])

    const allTags = useMemo(() => {
        const tagSet = new Set<string>()
        entries.forEach((entry) => {
        entry.tags.forEach((tag) => tagSet.add(tag))
        })
        return Array.from(tagSet).sort()
    }, [entries])

    const saveEntry = () => {
        if (!title.trim() && !content.trim()) return

        const entry: JournalEntry = {
        id: editingEntry?.id || Date.now().toString(),
        date: editingEntry?.date || dateString,
        title: title,
        content: content,
        tags: tags,
        createdAt: editingEntry?.createdAt || new Date().toISOString(),
        }

        const updatedEntries = editingEntry
        ? entries.map((e) => (e.id === editingEntry.id ? entry : e))
        : entries.filter((e) => e.date !== dateString).concat(entry)

        setEntries(updatedEntries)
        localStorage.setItem("journal", JSON.stringify(updatedEntries))
        setIsSaved(true)
        setEditingEntry(null)

        setTimeout(() => setIsSaved(false), 2000)
    }

    const confirmDelete = (id: string) => {
        setEntryToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const deleteEntry = () => {
        if (!entryToDelete) return

        const updatedEntries = entries.filter((e) => e.id !== entryToDelete)
        setEntries(updatedEntries)
        localStorage.setItem("journal", JSON.stringify(updatedEntries))

        if (editingEntry?.id === entryToDelete) {
        setEditingEntry(null)
        setTitle("")
        setContent("")
        setTags([])
        }

        setIsDeleteDialogOpen(false)
        setEntryToDelete(null)
    }

    const editEntry = (entry: JournalEntry) => {
        setEditingEntry(entry)
        setTitle(entry.title)
        setContent(entry.content)
        setTags(entry.tags || [])
        setActiveTab("write")
    }

    const cancelEdit = () => {
        setEditingEntry(null)
        const entry = entries.find((e) => e.date === dateString)
        if (entry) {
        setTitle(entry.title)
        setContent(entry.content)
        setTags(entry.tags || [])
        } else {
        setTitle("")
        setContent("")
        setTags([])
        }
    }

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
        setTagInput("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
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

    const formatDateShort = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        })
    }

    const hasEntry = entries.some((e) => e.date === dateString)
    const isToday = dateString === new Date().toISOString().split("T")[0]

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length

    return (
        <>
        <Card className="p-6 bg-blue-50 dark:bg-[#002855] border-1 border-blue-200 dark:border-[#002855]">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-900 dark:text-white" />
                <h3 className="text-xl font-bold text-blue-900 dark:text-white">Daily Journal</h3>
            </div>
            <Badge className="bg-blue-900 text-white hover:bg-blue-800">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-200/50">
                <TabsTrigger value="write" className="data-[state=active]:bg-[#8ec5ff] dark:data-[state=active]:bg-[#002855] data-[state=active]:text-white">
                <Edit2 className="h-4 w-4 mr-2" />
                Write
                </TabsTrigger>
                <TabsTrigger value="browse" className="data-[state=active]:bg-[#8ec5ff] dark:data-[state=active]:bg-[#002855] data-[state=active]:text-white">
                <FileText className="h-4 w-4 mr-2" />
                Browse
                </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-4 mt-4">
                {editingEntry && (
                <div className="bg-blue-300 dark:bg-[#001845] text-white px-4 py-2 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium">Editing: {formatDateShort(editingEntry.date)}</span>
                    <Button onClick={cancelEdit} size="sm" variant="ghost" className="text-blue-100 hover:bg-blue-800">
                    <X className="h-4 w-4" />
                    </Button>
                </div>
                )}

                <div className="flex items-center justify-between bg-white dark:bg-[#001845] p-3 rounded-lg border-1 border-blue-200 dark:border-[#002855]">
                <Button onClick={goToPreviousDay} size="sm" variant="ghost" className="text-blue-900 dark:text-white hover:bg-blue-100">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="text-center flex-1">
                    <div className="font-semibold text-blue-900 dark:text-white flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(currentDate)}
                    </div>
                    {!isToday && (
                    <Button onClick={goToToday} size="sm" variant="link" className="text-xs text-blue-900 dark:text-white hover:underline mt-1">
                        Back to today
                    </Button>
                    )}
                </div>
                <Button
                    onClick={goToNextDay}
                    size="sm"
                    variant="ghost"
                    className="text-blue-900 hover:bg-blue-100"
                    disabled={isToday}
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
                </div>

                <Input
                placeholder="Entry title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
                />

                <Textarea
                placeholder="What's on your mind today?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="resize-none pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845] min-h-[200px]"
                rows={8}
                />

                <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-blue-900 dark:text-white" />
                    <span className="text-sm font-medium text-blue-900 dark:text-white">Tags</span>
                </div>
                <div className="flex gap-2">
                    <Input
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
                    />
                    <Button onClick={addTag} size="sm" className="bg-blue-300 dark:bg-[#023E7D] hover:bg-blue-200 dark:hover:bg-[#001845] text-blue-100">
                    <Plus className="h-4 w-4" />
                    </Button>
                </div>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge
                        key={tag}
                        className="bg-blue-900 text-blue-100 hover:bg-blue-800 cursor-pointer"
                        onClick={() => removeTag(tag)}
                        >
                        {tag}
                        <X className="h-3 w-3 ml-1" />
                        </Badge>
                    ))}
                    </div>
                )}
                </div>

                <div className="flex gap-2">
                <Button
                    onClick={saveEntry}
                    className="flex-1 bg-blue-300 dark:bg-[#001845] hover:bg-blue-200 dark:hover:bg-[#023E7D] text-white"
                    disabled={!title.trim() && !content.trim()}
                >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaved ? "Saved!" : editingEntry ? "Update Entry" : "Save Entry"}
                </Button>
                {hasEntry && !editingEntry && (
                    <Button
                    onClick={() => confirmDelete(entries.find((e) => e.date === dateString)!.id)}
                    variant="destructive"
                    className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                    <Trash2 className="h-4 w-4" />
                    </Button>
                )}
                </div>

                <div className="text-xs text-gray-400 text-center">
                {wordCount} {wordCount === 1 ? "word" : "words"}
                </div>
            </TabsContent>

            <TabsContent value="browse" className="space-y-4 mt-4">
                <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-2.5 h-4 w-4 text-blue-900 dark:text-white" />
                    <Input
                    placeholder="Search entries"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
                    />
                    {searchQuery && (
                    <Button
                        onClick={() => setSearchQuery("")}
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1 text-blue-900 dark:text-white hover:bg-blue-100"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    )}
                </div>

                {allTags.length > 0 && (
                    <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-900 dark:text-white" />
                        <span className="text-sm font-medium text-blue-900 dark:text-white">Filter by tag:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge
                        className={`cursor-pointer ${
                            !selectedTag
                            ? "bg-blue-900 text-blue-100"
                            : "bg-white text-blue-900 border-blue-200 hover:bg-blue-100"
                        }`}
                        onClick={() => setSelectedTag(null)}
                        >
                        All
                        </Badge>
                        {allTags.map((tag) => (
                        <Badge
                            key={tag}
                            className={`cursor-pointer ${
                            selectedTag === tag
                                ? "bg-blue-900 text-blue-100"
                                : "bg-white text-blue-900 border-blue-200 hover:bg-blue-100"
                            }`}
                            onClick={() => setSelectedTag(tag)}
                        >
                            {tag}
                        </Badge>
                        ))}
                    </div>
                    </div>
                )}
                </div>

                <ScrollArea className="h-[400px] rounded-lg border-1 border-blue-200 dark:border-[#002855] bg-white/50 dark:bg-[#001845]">
                <div className="p-4 space-y-3">
                    {filteredEntries.length === 0 ? (
                    <div className="text-center py-12 text-blue-900/60 dark:text-white/60">
                        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50 dark:text-white" />
                        <p className="text-sm">No entries found</p>
                    </div>
                    ) : (
                    filteredEntries.map((entry) => (
                        <Card
                        key={entry.id}
                        className="p-4 bg-white dark:bg-[#33415C] transition-colors cursor-pointer"
                        >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-900 dark:text-white" />
                                <span className="text-sm font-medium text-blue-900 dark:text-white">{formatDateShort(entry.date)}</span>
                            </div>
                            <h4 className="font-semibold text-blue-900 dark:text-white">{entry.title}</h4>
                            <p className="text-sm text-blue-800 dark:text-white line-clamp-2">{entry.content}</p>
                            {entry.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                {entry.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-white">
                                    {tag}
                                    </Badge>
                                ))}
                                </div>
                            )}
                            </div>
                            <div className="flex gap-1">
                            <Button
                                onClick={() => editEntry(entry)}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-900 dark:text-gray-300 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800"
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={() => confirmDelete(entry.id)}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                        </div>
                        </Card>
                    ))
                    )}
                </div>
                </ScrollArea>
            </TabsContent>
            </Tabs>
        </Card>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="bg-white dark:bg-[#002855] border-blue-200 dark:border-[#002855]">
            <DialogHeader>
                <DialogTitle className="text-blue-900 dark:text-white">Delete Journal Entry</DialogTitle>
                <DialogDescription className="text-blue-900 dark:text-white">
                Are you sure you want to delete this entry? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="text-gray-700 dark:text-white bg-blue-200 dark:bg-blue-900 hover:text-gray-800 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-800 border-1 border-blue-200 dark:border-[#002855]"
                >
                Cancel
                </Button>
                <Button variant="destructive" onClick={deleteEntry} className="text-gray-700 dark:text-white bg-blue-50 dark:bg-blue-900 hover:text-gray-800 dark:hover:text-white hover:bg-blue-200 dark:hover:bg-blue-800 border-1 border-blue-200 dark:border-[#002855]">
                Delete
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}