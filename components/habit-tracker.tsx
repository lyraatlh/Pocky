"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Check, Flame, Target, Search, Edit, Upload, LinkIcon, Filter, ImageIcon } from "lucide-react"
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
    import { useHabits } from "@/hooks/use-habits"

    const HABIT_ICONS = ["💪", "📚", "💧", "🏃", "🧘", "🎨", "🎵", "🌱", "🍎", "😴", "🎯", "✨"]
    const CATEGORIES = ["Health", "Fitness", "Learning", "Productivity", "Mindfulness", "Creativity", "Other"]

    export function HabitTracker() {
    const { habits, addHabit, updateHabit, deleteHabit, toggleHabitToday } = useHabits()

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
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    const handleAddHabit = () => {
        if (formName.trim()) {
        addHabit({
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
        })
        resetForm()
        }
    }

    const handleUpdateHabit = () => {
        if (editingHabit && formName.trim()) {
        updateHabit(editingHabit.id, {
            name: formName,
            icon: iconType === "emoji" ? selectedIcon : "",
            customIconUrl: iconType === "url" ? customIconUrl : iconType === "upload" ? uploadedImage : undefined,
            description: formDescription,
            category: formCategory,
            goal: formGoal,
        })
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

    const handleToggleHabitToday = (id: string) => {
        toggleHabitToday(id)
    }

    const handleDeleteHabit = (id: string) => {
        deleteHabit(id)
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
            className="w-12 h-12 rounded-lg object-cover border-1 border-blue-200 dark:border-[#002855]"
            />
        )
        }
        return <span className="text-3xl">{habit.icon}</span>
    }

    return (
        <Card className="p-6 bg-blue-50 dark:bg-[#002855] border-1 border-blue-200 dark:border-[#002855]">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-200 dark:bg-blue-900 rounded-lg">
                <Target className="h-6 w-6 text-blue-900 dark:text-blue-200" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-white">Habit Tracker</h3>
                <p className="text-sm text-blue-900 dark:text-white">
                {totalCompleted} of {habits.length} completed • {completionRate}% today
                </p>
            </div>
            </div>
            <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            className="text-gray-700 dark:text-white bg-blue-200 dark:bg-[#023E7D] hover:text-gray-800 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-[#002855] border-1 border-blue-200 dark:border-[#023E7D]"
            >
            <Plus className="h-4 w-4" />
            Add Habit
            </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-3">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-900 dark:text-white" />
            <Input
                placeholder="Search habits"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
            />
            </div>
            <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-blue-300 dark:text-white" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48 border-1 border-blue-200 dark:border-[#002855] bg-white dark:bg-[#001845]">
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
        {filteredHabits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHabits.map((habit) => (
                <Card
                key={habit.id}
                className="p-4 bg-white dark:bg-[#001845] border-1 border-blue-100 dark:border-[#002855] hover:shadow-md transition-shadow"
                >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">{renderHabitIcon(habit)}</div>
                    <div className="flex-grow">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{habit.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{habit.description}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary">{habit.category}</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            {habit.streak}
                        </Badge>
                        </div>
                    </div>
                    </div>
                    <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(habit)} className="h-8 w-8 p-0 text-blue-900 dark:text-gray-300 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(habit.id)}
                        className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </div>
                </div>

                <Button
                    onClick={() => handleToggleHabitToday(habit.id)}
                    className={`w-full ${
                    isCompletedToday(habit)
                        ? "bg-blue-300 dark:bg-[#023E7D] hover:bg-blue-300/50 dark:hover:bg-[#023E7D]/50 text-white"
                        : "bg-blue-100 dark:bg-[#001233] text-gray-800 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-[#002855]"
                    }`}
                >
                    <Check className="h-4 w-4 mr-2" />
                    {isCompletedToday(habit) ? "Completed Today" : "Mark Complete Today"}
                </Button>
                </Card>
            ))}
            </div>
        ) : (
            <div className="text-center py-12">
            <Target className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No habits found. Start by adding your first habit!</p>
            </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isAdding || editingHabit !== null} onOpenChange={(open) => !open && resetForm()}>
            <DialogContent className="max-w-2xl bg-blue-100 dark:bg-[#001845] border-1 border-blue-300 dark:border-[#002855]">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-900 dark:text-white">
                {editingHabit ? "Edit Habit" : "Create New Habit"}
                </DialogTitle>
                <DialogDescription className="text-blue-900 dark:text-white">
                {editingHabit ? "Update your habit details" : "Set up a new habit to track"}
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                {/* Icon Selection */}
                <div>
                <label className="text-sm font-medium text-blue-900 dark:text-white mb-2 block">
                    Choose Icon Type
                </label>
                <Tabs value={iconType} onValueChange={(v) => setIconType(v as typeof iconType)}>
                    <TabsList className="w-full grid-cols-2 bg-blue-200/50">
                    <TabsTrigger value="emoji" className="data-[state=active]:bg-[#8ec5ff] dark:data-[state=active]:bg-[#002855] data-[state=active]:text-white">
                        Emoji
                    </TabsTrigger>
                    <TabsTrigger value="url" className="data-[state=active]:bg-[#8ec5ff] dark:data-[state=active]:bg-[#002855] data-[state=active]:text-white">
                        <LinkIcon className="w-4 h-4 mr-1" />
                        URL
                    </TabsTrigger>
                    <TabsTrigger
                        value="upload"
                        className="data-[state=active]:bg-[#8ec5ff] dark:data-[state=active]:bg-[#002855] data-[state=active]:text-white"
                    >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                    </TabsTrigger>
                    </TabsList>
                    <TabsContent value="emoji" className="mt-3">
                    <div className="flex gap-2 flex-wrap p-3 bg-white dark:bg-[#162556] rounded-lg border-1 border-blue-200 dark:border-[#002855]">
                        {HABIT_ICONS.map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            onClick={() => setSelectedIcon(icon)}
                            className={`text-2xl p-3 rounded-lg transition-all ${
                            selectedIcon === icon
                                ? "bg-blue-200 dark:bg-[#001233] scale-110 shadow-lg ring-2 ring-blue-200 dark:ring-[#001233]"
                                : "bg-gray-100 dark:bg-[#001845] hover:bg-blue-100 dark:hover:bg-[#001233] hover:scale-105"
                            }`}
                        >
                            {icon}
                        </button>
                        ))}
                    </div>
                    </TabsContent>
                    <TabsContent value="url" className="mt-3">
                    <div className="space-y-4">
                        <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400 dark:text-white" />
                        <Input
                            placeholder="https://example.com/image.png or .gif"
                            value={customIconUrl}
                            onChange={(e) => setCustomIconUrl(e.target.value)}
                            className="pl-10 border-1 border-blue-200 dark:border-[#002855] bg-white dark:bg-blue-950"
                        />
                        </div>
                        {customIconUrl && (
                        <div className="p-3 bg-white dark:bg-blue-950 rounded-lg border-1 border-blue-200 dark:border-[#002855]">
                            <p className="text-xs text-blue-700 dark:text-white mb-2">Preview:</p>
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
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full text-gray-700 dark:text-white bg-blue-200 dark:bg-[#023E7D] hover:text-gray-800 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-[#002855] border-1 border-blue-200 dark:border-[#023E7D]"
                        >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Choose Image or GIF
                        </Button>
                        <Upload className="h-5 w-5 text-blue-400" />
                        </div>
                        {uploadedImage && (
                        <div className="p-3 bg-white dark:bg-blue-950 rounded-lg border-1 border-blue-200 dark:border-[#002855]">
                            <p className="text-xs text-blue-900 dark:text-white mb-2">Preview:</p>
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
                    placeholder="Morning Exercise"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="border-1 border-blue-200 dark:border-[#002855] bg-white dark:bg-blue-950"
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
                    className="border-1 border-blue-200 dark:border-[#002855] bg-white dark:bg-blue-950 resize-none"
                    rows={3}
                />
                </div>

                {/* Category and Goal */}
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 block">Category</label>
                    <Select value={formCategory} onValueChange={setFormCategory}>
                    <SelectTrigger className="border-1 border-blue-200 dark:border-[#002855] bg-white dark:bg-blue-950">
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
                    className="border-1 border-blue-200 dark:border-[#002855] bg-white dark:bg-blue-950"
                    />
                </div>
                </div>
            </div>

            <DialogFooter>
                <Button
                variant="outline"
                onClick={resetForm}
                className="text-gray-700 dark:text-white bg-blue-100 dark:bg-[#002855] hover:text-gray-800 dark:hover:text-white hover:bg-blue-200 dark:hover:bg-[#023E7D] border-1 border-blue-200 dark:border-[#023E7D]"
                >
                Cancel
                </Button>
                <Button
                onClick={editingHabit ? handleUpdateHabit : handleAddHabit}
                className="text-gray-700 dark:text-white bg-blue-200 dark:bg-[#023E7D] hover:text-gray-800 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-[#002855] border-1 border-blue-200 dark:border-[#023E7D]"
                >
                {editingHabit ? "Update Habit" : "Create Habit"}
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
            <DialogContent className="bg-blue-50 dark:bg-[#001845] border-1 border-blue-200 dark:border-[#002855]">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold text-blue-900 dark:text-white">Delete Habit?</DialogTitle>
                <DialogDescription className="text-blue-900 dark:text-white">
                Are you sure you want to delete this habit? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                className="text-gray-700 dark:text-white bg-blue-200 dark:bg-[#023E7D] hover:text-gray-800 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-[#002855] border-1 border-blue-200 dark:border-[#023E7D]"
                >
                Cancel
                </Button>
                <Button
                variant="destructive"
                onClick={() => handleDeleteHabit(deleteConfirm!)}
                className="text-gray-700 dark:text-white bg-blue-100 dark:bg-[#002855] hover:text-gray-800 dark:hover:text-white hover:bg-blue-200 dark:hover:bg-[#023E7D] border-1 border-blue-200 dark:border-[#023E7D]"
                >
                Delete
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </Card>
    )
}