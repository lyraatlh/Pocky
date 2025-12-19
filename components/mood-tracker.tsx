"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    } from "@/components/ui/dialog"
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
    import { Label } from "@/components/ui/label"
    import type { MoodEntry, MoodPreset } from "@/types/mood"
    import {
    Calendar,
    Search,
    Trash2,
    Edit2,
    Plus,
    Upload,
    LinkIcon,
    Smile,
    ImageIcon,
    Filter,
    TrendingUp,
    } from "lucide-react"

    const DEFAULT_MOODS: MoodPreset[] = [
    { value: "great", emoji: "😄", label: "Amazing", color: "#3b82f6", bgColor: "bg-blue-500" },
    { value: "good", emoji: "😊", label: "Good", color: "#60a5fa", bgColor: "bg-blue-400" },
    { value: "okay", emoji: "😐", label: "Okay", color: "#93c5fd", bgColor: "bg-blue-300" },
    { value: "bad", emoji: "😔", label: "Not Great", color: "#2563eb", bgColor: "bg-blue-600" },
    { value: "terrible", emoji: "😢", label: "Tough", color: "#1e40af", bgColor: "bg-blue-700" },
    ]

    export function MoodTracker() {
    const [moods, setMoods] = useState<MoodEntry[]>([])
    const [customMoods, setCustomMoods] = useState<MoodPreset[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filterMood, setFilterMood] = useState<string>("all")
    const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null)
    const [isAddMoodDialogOpen, setIsAddMoodDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null)

    // Form states
    const [selectedMood, setSelectedMood] = useState<string | null>(null)
    const [note, setNote] = useState("")
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

    // Custom mood creation states
    const [newMoodLabel, setNewMoodLabel] = useState("")
    const [newMoodColor, setNewMoodColor] = useState("#3b82f6")
    const [newMoodIconType, setNewMoodIconType] = useState<"emoji" | "url" | "upload">("emoji")
    const [newMoodEmoji, setNewMoodEmoji] = useState("😊")
    const [newMoodUrl, setNewMoodUrl] = useState("")
    const [newMoodUploadPreview, setNewMoodUploadPreview] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const allMoods = [...DEFAULT_MOODS, ...customMoods]

    useEffect(() => {
        const savedMoods = localStorage.getItem("moods")
        const savedCustomMoods = localStorage.getItem("customMoods")

        if (savedMoods) {
        setMoods(JSON.parse(savedMoods))
        }
        if (savedCustomMoods) {
        setCustomMoods(JSON.parse(savedCustomMoods))
        }
    }, [])

    const saveMood = () => {
        if (!selectedMood) return

        const mood = allMoods.find((m) => m.value === selectedMood)
        if (!mood) return

        const entry: MoodEntry = {
        id: editingEntry?.id || Date.now().toString(),
        date: selectedDate,
        mood: selectedMood,
        moodLabel: mood.label,
        note: note,
        color: mood.color,
        icon: mood.emoji,
        iconType: "emoji",
        }

        let updatedMoods: MoodEntry[]
        if (editingEntry) {
        updatedMoods = moods.map((m) => (m.id === editingEntry.id ? entry : m))
        } else {
        updatedMoods = [...moods, entry]
        }

        updatedMoods.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setMoods(updatedMoods)
        localStorage.setItem("moods", JSON.stringify(updatedMoods))

        resetForm()
    }

    const resetForm = () => {
        setSelectedMood(null)
        setNote("")
        setSelectedDate(new Date().toISOString().split("T")[0])
        setEditingEntry(null)
    }

    const editEntry = (entry: MoodEntry) => {
        setEditingEntry(entry)
        setSelectedMood(entry.mood)
        setNote(entry.note || "")
        setSelectedDate(entry.date)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const deleteEntry = (id: string) => {
        setEntryToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (!entryToDelete) return
        const updatedMoods = moods.filter((m) => m.id !== entryToDelete)
        setMoods(updatedMoods)
        localStorage.setItem("moods", JSON.stringify(updatedMoods))
        setIsDeleteDialogOpen(false)
        setEntryToDelete(null)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
            setNewMoodUploadPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        }
    }

    const addCustomMood = () => {
        if (!newMoodLabel) return

        let icon = newMoodEmoji
        let iconType: "emoji" | "url" | "upload" = "emoji"

        if (newMoodIconType === "url" && newMoodUrl) {
        icon = newMoodUrl
        iconType = "url"
        } else if (newMoodIconType === "upload" && newMoodUploadPreview) {
        icon = newMoodUploadPreview
        iconType = "upload"
        }

        const newMood: MoodPreset = {
        value: `custom-${Date.now()}`,
        emoji: icon,
        label: newMoodLabel,
        color: newMoodColor,
        bgColor: "bg-blue-500",
        }

        const updatedCustomMoods = [...customMoods, newMood]
        setCustomMoods(updatedCustomMoods)
        localStorage.setItem("customMoods", JSON.stringify(updatedCustomMoods))

        setIsAddMoodDialogOpen(false)
        setNewMoodLabel("")
        setNewMoodEmoji("😊")
        setNewMoodUrl("")
        setNewMoodUploadPreview("")
        setNewMoodColor("#3b82f6")
    }

    const filteredEntries = moods.filter((entry) => {
        const matchesSearch =
        (entry.moodLabel && entry.moodLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (entry.note && entry.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (entry.date && entry.date.includes(searchQuery))

        const matchesFilter = filterMood === "all" || entry.mood === filterMood

        return matchesSearch && matchesFilter
    })

    const moodCounts = moods.reduce(
        (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
        },
        {} as Record<string, number>,
    )

    const totalEntries = moods.length
    const dominantMood = totalEntries > 0 ? Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] : null

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/40 border-1 border-blue-200 dark:border-blue-900">
        <div className="flex items-center justify-between mb-6">
            <div>
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">Mood Tracker</h3>
            <p className="text-sm text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {totalEntries} {totalEntries === 1 ? "entry" : "entries"} logged
            </p>
            </div>
            {dominantMood && totalEntries > 3 && (
            <div className="text-right bg-white/50 dark:bg-blue-950/50 p-3 rounded-xl">
                <p className="text-xs text-blue-900 dark:text-blue-400 mb-1 flex items-center gap-1 justify-end">
                <TrendingUp className="w-3 h-3" />
                Most common
                </p>
                <div className="flex items-center gap-2">
                <span className="text-2xl">{allMoods.find((m) => m.value === dominantMood)?.emoji}</span>
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {allMoods.find((m) => m.value === dominantMood)?.label}
                </span>
                </div>
            </div>
            )}
        </div>

        <div className="space-y-6">
            {/* Add/Edit Mood Form */}
            <div className="bg-white/70 dark:bg-blue-900/50 p-5 rounded-xl space-y-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                {editingEntry ? "Edit Mood Entry" : "How are you feeling?"}
                </p>
                {editingEntry && (
                <Button variant="ghost" size="sm" onClick={resetForm} className="text-gray-700 dark:text-white bg-blue-200 dark:bg-blue-900 hover:text-gray-800 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-800 border-1 border-blue-200 dark:border-blue-900">
                    Cancel Edit
                </Button>
                )}
            </div>

            <div>
                <Label className="text-xs text-blue-900 dark:text-blue-300 mb-2 block">Date</Label>
                <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-blue-300 dark:border-blue-600 bg-white dark:bg-blue-950 focus:ring-blue-500"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                <Label className="text-xs text-blue-900 dark:text-blue-300">Select Mood</Label>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddMoodDialogOpen(true)}
                    className="text-gray-700 dark:text-white bg-blue-200 dark:bg-blue-900 hover:text-gray-800 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-800 border-1 border-blue-200 dark:border-blue-900"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Custom
                </Button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                {allMoods.map((mood) => (
                    <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                        selectedMood === mood.value
                        ? "bg-blue-300 dark:bg-blue-600 shadow-lg scale-105"
                        : "bg-white/80 dark:bg-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-700 hover:scale-105"
                    }`}
                    >
                    {mood.emoji.startsWith("http") || mood.emoji.startsWith("data:") ? (
                        <img src={mood.emoji || "/placeholder.svg"} alt={mood.label} className="w-8 h-8 object-contain" />
                    ) : (
                        <span className="text-3xl">{mood.emoji}</span>
                    )}
                    <span
                        className={`text-xs font-medium text-center ${
                        selectedMood === mood.value ? "text-white" : "text-blue-900 dark:text-blue-100"
                        }`}
                    >
                        {mood.label}
                    </span>
                    </button>
                ))}
                </div>
            </div>

            <div>
                <Label className="text-xs text-blue-900 dark:text-blue-300 mb-2 block">Notes (optional)</Label>
                <Textarea
                placeholder="What made you feel this way? Any thoughts to remember"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="placeholder:text-gray-300 resize-none border-blue-300 dark:border-blue-600 bg-white dark:bg-blue-950 focus:ring-blue-500 rounded-lg"
                rows={3}
                />
            </div>

            <Button
                onClick={saveMood}
                disabled={!selectedMood}
                className="w-full text-gray-700 dark:text-white bg-blue-200 dark:bg-blue-900 hover:text-gray-800 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-800 border-1 border-blue-200 dark:border-blue-900"
            >
                {editingEntry ? "Update Mood" : "Save Mood"}
            </Button>
            </div>

            {/* Search and Filter */}
            {moods.length > 0 && (
            <div className="bg-white/70 dark:bg-blue-900/50 p-4 rounded-xl space-y-3 border border-blue-200 dark:border-blue-700">
                <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-900" />
                    <Input
                    placeholder="Search by mood, notes, or date"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="placeholder:text-gray-300 pl-10 border-blue-300 dark:border-blue-600 bg-white dark:bg-blue-950 focus:ring-blue-500"
                    />
                </div>
                <div className="relative min-w-[150px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-900" />
                    <select
                    value={filterMood}
                    onChange={(e) => setFilterMood(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-300 dark:border-blue-600 bg-white dark:bg-blue-950 text-sm focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    >
                    <option value="all">All Moods</option>
                    {allMoods.map((mood) => (
                        <option key={mood.value} value={mood.value}>
                        {mood.label}
                        </option>
                    ))}
                    </select>
                </div>
                </div>
            </div>
            )}

            {/* Mood History */}
            {filteredEntries.length > 0 ? (
            <div className="space-y-3">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Mood History ({filteredEntries.length})
                </p>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {filteredEntries.map((entry) => {
                    const mood = allMoods.find((m) => m.value === entry.mood)
                    return (
                    <div
                        key={entry.id}
                        className="bg-white/80 dark:bg-blue-900/60 p-4 rounded-xl border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="flex-shrink-0">
                            {mood?.emoji.startsWith("http") || mood?.emoji.startsWith("data:") ? (
                                <img
                                src={mood.emoji || "/placeholder.svg"}
                                alt={mood.label}
                                className="w-10 h-10 object-contain"
                                />
                            ) : (
                                <span className="text-3xl">{mood?.emoji}</span>
                            )}
                            </div>
                            <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-blue-900 dark:text-blue-100">{entry.moodLabel}</span>
                                <span className="text-xs text-blue-900 dark:text-blue-400">
                                {new Date(entry.date).toLocaleDateString("id-ID", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                                </span>
                            </div>
                            {entry.note && (
                                <p className="text-sm text-blue-900 dark:text-blue-300 line-clamp-2">{entry.note}</p>
                            )}
                            </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editEntry(entry)}
                            className="h-8 w-8 p-0 text-blue-900 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800"
                            >
                            <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEntry(entry.id)}
                            className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                            >
                            <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        </div>
                    </div>
                    )
                })}
                </div>
            </div>
            ) : moods.length > 0 ? (
            <div className="text-center py-8 text-blue-600 dark:text-blue-400">
                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No moods found matching your search</p>
            </div>
            ) : null}

            {/* Statistics */}
            {moods.length > 0 && (
            <div className="bg-white/70 dark:bg-blue-900/50 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">Mood Statistics</p>
                <div className="space-y-2">
                {Object.entries(moodCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([moodValue, count]) => {
                    const mood = allMoods.find((m) => m.value === moodValue)
                    const percentage = ((count / totalEntries) * 100).toFixed(1)
                    return (
                        <div key={moodValue} className="flex items-center gap-3">
                        <div className="flex items-center gap-2 w-32">
                            {mood?.emoji.startsWith("http") || mood?.emoji.startsWith("data:") ? (
                            <img
                                src={mood.emoji || "/placeholder.svg"}
                                alt={mood.label}
                                className="w-5 h-5 object-contain"
                            />
                            ) : (
                            <span className="text-lg">{mood?.emoji}</span>
                            )}
                            <span className="text-sm text-blue-900 dark:text-blue-100">{mood?.label}</span>
                        </div>
                        <div className="flex-1 bg-blue-100 dark:bg-blue-950 rounded-full h-2">
                            <div
                            className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <span className="text-xs text-blue-900 dark:text-blue-300 w-16 text-right">
                            {count} ({percentage}%)
                        </span>
                        </div>
                    )
                    })}
                </div>
            </div>
            )}
        </div>

        {/* Add Custom Mood Dialog */}
        <Dialog open={isAddMoodDialogOpen} onOpenChange={setIsAddMoodDialogOpen}>
            <DialogContent className="bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-950 dark:to-blue-950 border-blue-300 dark:border-blue-700">
            <DialogHeader>
                <DialogTitle className="text-blue-900 dark:text-blue-100">Add Custom Mood</DialogTitle>
                <DialogDescription className="text-blue-900 dark:text-blue-300">
                Create a personalized mood with custom icon
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                <div>
                <div className="flex items-center justify-between mb-2">    
                <Label className="text-blue-900 dark:text-blue-100">Mood Name</Label>
                </div>
                <Input
                    placeholder="Excited, Peaceful, Energetic"
                    value={newMoodLabel}
                    onChange={(e) => setNewMoodLabel(e.target.value)}
                    className="placeholder:text-gray-300 border-blue-300 dark:border-blue-600 bg-white dark:bg-blue-950"
                />
                </div>

                <div>
                <Label className="text-blue-900 dark:text-blue-100 mb-2 block">Icon</Label>
                <Tabs value={newMoodIconType} onValueChange={(v) => setNewMoodIconType(v as any)}>
                    <TabsList className="grid w-full grid-cols-3 bg-blue-200 dark:bg-blue-800">
                    <TabsTrigger value="emoji" className="data-[state=active]:bg-blue-300 data-[state=active]:text-white">
                        <Smile className="w-4 h-4 mr-1" />
                        Emoji
                    </TabsTrigger>
                    <TabsTrigger value="url" className="data-[state=active]:bg-blue-300 data-[state=active]:text-white">
                        <LinkIcon className="w-4 h-4 mr-1" />
                        URL
                    </TabsTrigger>
                    <TabsTrigger
                        value="upload"
                        className="data-[state=active]:bg-blue-300 data-[state=active]:text-white"
                    >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                    </TabsTrigger>
                    </TabsList>

                    <TabsContent value="emoji" className="space-y-2">
                    <Input
                        placeholder="💙"
                        value={newMoodEmoji}
                        onChange={(e) => setNewMoodEmoji(e.target.value)}
                        className="placeholder:text-gray-300 text-2xl text-center border-blue-300 dark:border-blue-600 bg-white dark:bg-blue-950"
                    />
                    <p className="text-xs text-blue-900 dark:text-blue-400 text-center">Paste any emoji you like</p>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-2">
                    <Input
                        placeholder="https://example.com/image.png or .gif"
                        value={newMoodUrl}
                        onChange={(e) => setNewMoodUrl(e.target.value)}
                        className="placeholder:text-gray-300 border-blue-300 dark:border-blue-600 bg-white dark:bg-blue-950"
                    />
                    {newMoodUrl && (
                        <div className="flex justify-center p-2 bg-white dark:bg-blue-950 rounded-lg">
                        <img src={newMoodUrl || "/placeholder.svg"} alt="Preview" className="w-16 h-16 object-contain" />
                        </div>
                    )}
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full text-gray-700 dark:text-white bg-blue-200 dark:bg-blue-900 hover:text-gray-800 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-800 border-1 border-blue-200 dark:border-blue-900"
                    >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Choose Image or GIF
                    </Button>
                    {newMoodUploadPreview && (
                        <div className="flex justify-center p-2 bg-white dark:bg-blue-950 rounded-lg">
                        <img
                            src={newMoodUploadPreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-16 h-16 object-contain"
                        />
                        </div>
                    )}
                    </TabsContent>
                </Tabs>
                </div>
            </div>

            <DialogFooter>
                <Button
                variant="outline"
                onClick={() => setIsAddMoodDialogOpen(false)}
                className="text-gray-700 dark:text-white bg-blue-200 dark:bg-blue-900 hover:text-gray-800 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-800 border-1 border-blue-200 dark:border-blue-900"
                >
                Cancel
                </Button>
                <Button
                onClick={addCustomMood}
                disabled={!newMoodLabel}
                className="text-gray-700 dark:text-white bg-blue-200 dark:bg-blue-900 hover:text-gray-800 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-800 border-1 border-blue-200 dark:border-blue-900"
                >
                Add Mood
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-700">
            <DialogHeader>
                <DialogTitle className="text-blue-900 dark:text-blue-100">Delete Mood Entry</DialogTitle>
                <DialogDescription className="text-blue-900 dark:text-blue-300">
                Are you sure you want to delete this mood entry? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className=" text-gray-700 dark:text-white bg-blue-200 dark:bg-blue-900 hover:text-gray-800 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-800 border-1 border-blue-200 dark:border-blue-900"
                >
                Cancel
                </Button>
                <Button onClick={confirmDelete} className="text-gray-700 dark:text-white bg-blue-50 dark:bg-blue-900 hover:text-gray-800 dark:hover:text-white hover:bg-blue-200 dark:hover:bg-blue-800 border-1 border-blue-200 dark:border-blue-900">
                Delete
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </Card>
    )
}