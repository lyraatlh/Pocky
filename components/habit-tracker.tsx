"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Check, Flame, Target, Search, Edit, Upload, LinkIcon, Filter, TrendingUp } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    } from "@/components/ui/dialog"
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
    import { Badge } from "@/components/ui/badge"
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
    import type { Habit } from "@/types/habit"

    const HABIT_ICONS = ["💪", "📚", "💧", "🏃", "🧘", "🎨", "🎵", "🌱", "🍎", "😴", "🎯", "✨"]
    const CATEGORIES = ["Health", "Fitness", "Learning", "Productivity", "Mindfulness", "Creativity", "Other"]

    export function HabitTracker() {
    const [habits, setHabits] = useState<Habit[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filterCategory, setFilterCategory] = useState<string>("all")
    const [isAdding, setIsAdding] = useState(false)
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    // Form states
    const [formName, setFormName] = useState("")
    const [formDescription, setFormDescription] = useState("")
    const [formCategory, setFormCategory] = useState("Health")
    const [formGoal, setFormGoal] = useState<number>(30)
    const [selectedIcon, setSelectedIcon] = useState("💪")
    const [customIconUrl, setCustomIconUrl] = useState("")
    const [iconType, setIconType] = useState<"emoji" | "url" | "upload">("emoji")
    const [uploadedImage, setUploadedImage] = useState<string>("")

    useEffect(() => {
        const saved = localStorage.getItem("habits")
        if (saved) {
        setHabits(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("habits", JSON.stringify(habits))
    }, [habits])

    const resetForm = () => {
        setFormName("")
        setFormDescription("")
        setFormCategory("Health")
        setFormGoal(30)
        setSelectedIcon("💪")
        setCustomIconUrl("")
        setIconType("emoji")
        setUploadedImage("")
        setIsAdding(false)
        setEditingHabit(null)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
            setUploadedImage(reader.result as string)
        }
        reader.readAsDataURL(file)
        }
    }

    const addHabit = () => {
        if (formName.trim()) {
        const habit: Habit = {
            id: Date.now().toString(),
            name: formName,
            icon: iconType === "emoji" ? selectedIcon : "",
            customIconUrl: iconType === "url" ? customIconUrl : iconType === "upload" ? uploadedImage : undefined,
            description: formDescription,
            category: formCategory,
            goal: formGoal,
            streak: 0,
            completedDates: [],
            color: "bg-blue-200 border-blue-200",
            createdAt: new Date().toISOString(),
        }
        setHabits([...habits, habit])
        resetForm()
        }
    }

    const updateHabit = () => {
        if (editingHabit && formName.trim()) {
        setHabits(
            habits.map((h) =>
            h.id === editingHabit.id
                ? {
                    ...h,
                    name: formName,
                    icon: iconType === "emoji" ? selectedIcon : "",
                    customIconUrl: iconType === "url" ? customIconUrl : iconType === "upload" ? uploadedImage : undefined,
                    description: formDescription,
                    category: formCategory,
                    goal: formGoal,
                }
                : h,
            ),
        )
        resetForm()
        }
    }

    const openEditDialog = (habit: Habit) => {
        setEditingHabit(habit)
        setFormName(habit.name)
        setFormDescription(habit.description || "")
        setFormCategory(habit.category || "Health")
        setFormGoal(habit.goal || 30)

        if (habit.customIconUrl) {
        if (habit.customIconUrl.startsWith("data:")) {
            setIconType("upload")
            setUploadedImage(habit.customIconUrl)
        } else {
            setIconType("url")
            setCustomIconUrl(habit.customIconUrl)
        }
        } else {
        setIconType("emoji")
        setSelectedIcon(habit.icon)
        }
    }

    const toggleHabitToday = (id: string) => {
        const today = new Date().toISOString().split("T")[0]
        setHabits(
        habits.map((habit) => {
            if (habit.id === id) {
            const completedDates = [...habit.completedDates]
            const index = completedDates.indexOf(today)

            if (index > -1) {
                completedDates.splice(index, 1)
                return { ...habit, completedDates, streak: Math.max(0, habit.streak - 1) }
            } else {
                completedDates.push(today)
                return { ...habit, completedDates, streak: habit.streak + 1 }
            }
            }
            return habit
        }),
        )
    }

    const deleteHabit = (id: string) => {
        setHabits(habits.filter((h) => h.id !== id))
        setDeleteConfirm(null)
    }

    const isCompletedToday = (habit: Habit) => {
        const today = new Date().toISOString().split("T")[0]
        return habit.completedDates.includes(today)
    }

    const filteredHabits = habits.filter((habit) => {
        const matchesSearch =
        habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        habit.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = filterCategory === "all" || habit.category === filterCategory
        return matchesSearch && matchesCategory
    })

    const totalCompleted = habits.filter(isCompletedToday).length
    const completionRate = habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0

    const renderHabitIcon = (habit: Habit) => {
        if (habit.customIconUrl) {
        return (
            <img
            src={habit.customIconUrl || "/placeholder.svg"}
            alt={habit.name}
            className="w-12 h-12 rounded-lg object-cover border-2 border-blue-200 dark:border-blue-900"
            />
        )
        }
        return <span className="text-3xl">{habit.icon}</span>
    }

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/40 border-1 border-blue-200 dark:border-blue-900">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-200 dark:bg-blue-900 rounded-lg">
                <Target className="h-6 w-6 text-blue-900 dark:text-blue-200" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Habit Tracker</h3>
                <p className="text-sm text-blue-900 dark:text-blue-100">
                {totalCompleted} of {habits.length} completed • {completionRate}% today
                </p>
            </div>
            </div>
            <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            className="bg-gradient-to-r 
                        from-blue-300 
                        to-blue-300 
                        dark:from-blue-700
                        dark:to-blue-700
                        hover:from-blue-200 
                        hover:to-blue-200 
                        dark:hover:from-blue-800/40
                        dark:hover:to-blue-800/40
                        text-white 
                        rounded-lg
                        ">
            <Plus className="h-4 w-4" />
            Add Habit
            </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-3">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-900" />
            <Input
                placeholder="Search habits"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-blue-200 dark:border-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-blue-950"
            />
            </div>
            <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-blue-300 dark:text-blue-700" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950">
                <SelectValue />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                    {cat}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>
        </div>

        {/* Habits List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {filteredHabits.length === 0 ? (
            <div className="text-center py-12 px-4">
                <Target className="w-16 h-16 text-blue-300 dark:text-blue-300 mx-auto mb-4" />
                <p className="text-blue-900 dark:text-blue-100 font-medium">
                {searchQuery || filterCategory !== "all" ? "No habits found" : "No habits yet"}
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-100">
                {searchQuery || filterCategory !== "all"
                    ? "Try adjusting your filters"
                    : "Start building good habits today!"}
                </p>
            </div>
            ) : (
            filteredHabits.map((habit) => (
                <div
                key={habit.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    isCompletedToday(habit)
                    ? "bg-blue-200 dark:bg-blue-900 border-blue-200 dark:border-blue-600 shadow-lg"
                    : "bg-white dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:border-blue-200 dark:hover:border-blue-200"
                }`}
                >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                    {renderHabitIcon(habit)}
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        {habit.name}
                        {habit.category && (
                            <Badge className="bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 text-xs">
                            {habit.category}
                            </Badge>
                        )}
                        </div>
                        {habit.description && (
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{habit.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400">
                            <Flame className="h-4 w-4" />
                            <span className="font-bold">{habit.streak}</span>
                            <span className="text-xs">days</span>
                        </div>
                        {habit.goal && (
                            <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-xs">
                                {habit.streak}/{habit.goal} goal
                            </span>
                            </div>
                        )}
                        </div>
                    </div>
                    </div>
                    <div className="flex gap-2">
                    <Button
                        onClick={() => toggleHabitToday(habit.id)}
                        size="sm"
                        className={
                        isCompletedToday(habit)
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-lg"
                            : "bg-white dark:bg-blue-900 hover:bg-blue-50 dark:hover:bg-blue-800 text-blue-900 dark:text-blue-100 border-2 border-blue-200 dark:border-blue-700 rounded-lg"
                        }
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => openEditDialog(habit)}
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => setDeleteConfirm(habit.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </div>
                </div>
                </div>
            ))
            )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isAdding || editingHabit !== null} onOpenChange={(open) => !open && resetForm()}>
            <DialogContent className="max-w-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-300 dark:border-blue-900">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {editingHabit ? "Edit Habit" : "Create New Habit"}
                </DialogTitle>
                <DialogDescription className="text-blue-900 dark:text-blue-100">
                {editingHabit ? "Update your habit details" : "Set up a new habit to track"}
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                {/* Icon Selection */}
                <div>
                <label className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 block">
                    Choose Icon Type
                </label>
                <Tabs value={iconType} onValueChange={(v) => setIconType(v as typeof iconType)}>
                    <TabsList className="grid w-full grid-cols-3 bg-blue-200 dark:bg-blue-900">
                    <TabsTrigger value="emoji">Emoji</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="emoji" className="mt-3">
                    <div className="flex gap-2 flex-wrap p-3 bg-white dark:bg-gray-900 rounded-lg border-2 border-blue-200 dark:border-blue-900">
                        {HABIT_ICONS.map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            onClick={() => setSelectedIcon(icon)}
                            className={`text-2xl p-3 rounded-lg transition-all ${
                            selectedIcon === icon
                                ? "bg-blue-200 dark:bg-blue-900 scale-110 shadow-lg ring-2 ring-blue-200 dark:ring-blue-900"
                                : "bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 hover:scale-105"
                            }`}
                        >
                            {icon}
                        </button>
                        ))}
                    </div>
                    </TabsContent>
                    <TabsContent value="url" className="mt-3">
                    <div className="space-y-2">
                        <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                        <Input
                            placeholder="https://example.com/image.png or .gif"
                            value={customIconUrl}
                            onChange={(e) => setCustomIconUrl(e.target.value)}
                            className="pl-10 border-2 border-blue-200 dark:border-blue-900 bg-white dark:bg-blue-950"
                        />
                        </div>
                        {customIconUrl && (
                        <div className="p-3 bg-white dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">Preview:</p>
                            <img
                            src={customIconUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="w-16 h-16 rounded-lg object-cover"
                            />
                        </div>
                        )}
                    </div>
                    </TabsContent>
                    <TabsContent value="upload" className="mt-3">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950"
                        />
                        <Upload className="h-5 w-5 text-blue-400" />
                        </div>
                        {uploadedImage && (
                        <div className="p-3 bg-white dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">Preview:</p>
                            <img
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Preview"
                            className="w-16 h-16 rounded-lg object-cover"
                            />
                        </div>
                        )}
                    </div>
                    </TabsContent>
                </Tabs>
                </div>

                {/* Name */}
                <div>
                <label className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 block">Habit Name</label>
                <Input
                    placeholder="e.g., Morning Exercise"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950"
                />
                </div>

                {/* Description */}
                <div>
                <label className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 block">
                    Description (Optional)
                </label>
                <Textarea
                    placeholder="What does this habit mean to you?"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950 resize-none"
                    rows={3}
                />
                </div>

                {/* Category and Goal */}
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 block">Category</label>
                    <Select value={formCategory} onValueChange={setFormCategory}>
                    <SelectTrigger className="border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                            {cat}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 block">Goal (Days)</label>
                    <Input
                    type="number"
                    min="1"
                    value={formGoal}
                    onChange={(e) => setFormGoal(Number(e.target.value))}
                    className="border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950"
                    />
                </div>
                </div>
            </div>

            <DialogFooter>
                <Button
                variant="outline"
                onClick={resetForm}
                className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-200 hover:to-blue-300 dark:from-blue-950 dark:blue-800 dark:to-blue-800 dark:hover:from-blue-800 hover:to-blue-900 dark:border-blue-900">
                Cancel
                </Button>
                <Button
                onClick={editingHabit ? updateHabit : addHabit}
                className="text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 hover:text-white hover:from-blue-200 hover:to-blue-300 dark:from-blue-950 dark:blue-800 dark:to-blue-800 dark:hover:from-blue-800 hover:to-blue-900 dark:border-blue-900"
                >
                {editingHabit ? "Update Habit" : "Create Habit"}
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
            <DialogContent className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-200 dark:border-blue-700">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">Delete Habit</DialogTitle>
                <DialogDescription className="text-blue-700 dark:text-blue-300">
                Are you sure? This will permanently delete this habit and all its progress.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                className="border-2 border-blue-200 dark:border-blue-800"
                >
                Cancel
                </Button>
                <Button
                onClick={() => deleteConfirm && deleteHabit(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white"
                >
                Delete
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </Card>
    )
}