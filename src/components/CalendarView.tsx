import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, isSameDay, parseISO } from "date-fns";
import { type Announcement } from "@/data/announcements";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import AnnouncementCard from "@/components/AnnouncementCard";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarViewProps {
    announcements: Announcement[];
}

export default function CalendarView({ announcements }: CalendarViewProps) {
    const { toggleBookmark } = useAnnouncements();
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());

    // Filter announcements for the selected day
    const dayAnnouncements = announcements.filter((a) => {
        // Check both eventDate and createdAt
        const date = a.eventDate ? parseISO(a.eventDate) : parseISO(a.createdAt);
        return selectedDay && isSameDay(date, selectedDay);
    });

    // Get all dates that have announcements to show dots
    const highlightedModifier = (date: Date) => {
        return announcements.some((a) => {
            const adate = a.eventDate ? parseISO(a.eventDate) : parseISO(a.createdAt);
            return isSameDay(adate, date);
        });
    };

    return (
        <div className="grid lg:grid-cols-[400px,1fr] gap-6 sm:gap-8 animate-fade-in items-start relative">
            {/* Calendar Column */}
            <div className="lg:sticky lg:top-24 z-20 w-full">
                <div className="campus-card-static p-5 sm:p-6 bg-card border border-border/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <CalendarIcon className="h-5 w-5" strokeWidth={2.5} />
                        <h2 className="font-bold text-lg tracking-tight">Event Schedule</h2>
                    </div>

                    <div className="flex justify-center">
                        <DayPicker
                            mode="single"
                            selected={selectedDay}
                            onSelect={setSelectedDay}
                            modifiers={{ highlighted: highlightedModifier }}
                            modifiersClassNames={{
                                highlighted: "relative after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full after:ring-1 after:ring-background"
                            }}
                            className="p-1 sm:p-3 border-none capitalize w-full"
                            showOutsideDays
                            classNames={{
                                root: "w-full flex justify-center",
                                months: "w-full flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                month: "w-full space-y-4",
                                caption: "w-full flex justify-between pt-1 relative items-center mb-6 px-4",
                                caption_label: "text-sm font-bold text-foreground tracking-wide",
                                nav: "space-x-1 flex items-center bg-muted/30 p-1 rounded-xl border border-border/50",
                                nav_button: "h-8 w-8 bg-transparent p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all flex items-center justify-center",
                                table: "w-full border-collapse space-y-2",
                                head_row: "flex justify-between w-full mb-2",
                                head_cell: "text-muted-foreground rounded-md w-11 font-bold text-[10px] uppercase tracking-widest text-center",
                                row: "flex w-full mt-2 justify-between",
                                cell: "h-11 w-11 text-center text-sm p-0 relative focus-within:z-20",
                                day: "h-11 w-11 p-0 font-semibold aria-selected:opacity-100 hover:bg-primary/10 hover:text-primary rounded-xl transition-all flex items-center justify-center",
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-lg shadow-primary/30 scale-105",
                                day_today: "text-primary font-black scale-110 before:absolute before:inset-0 before:border-2 before:border-primary/20 before:rounded-xl",
                                day_outside: "text-muted-foreground/30 opacity-50 font-normal",
                                day_disabled: "text-muted-foreground opacity-50",
                                day_hidden: "invisible",
                            }}
                            components={{
                                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                                IconRight: () => <ChevronRight className="h-4 w-4" />,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Notices Column */}
            <div className="space-y-4 flex flex-col min-h-[400px]">
                {/* Date Header - Sticky on mobile below main header */}
                <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-md rounded-2xl border border-border shadow-sm sticky top-[4.5rem] lg:relative lg:top-0 z-10 transition-all">
                    <div className="flex flex-col">
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-80">
                            Selected Date
                        </h3>
                        <p className="text-lg sm:text-base font-black mt-1 text-foreground">
                            {selectedDay ? format(selectedDay, "EEEE, MMMM d") : "Select a day"}
                        </p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20">
                        {dayAnnouncements.length} {dayAnnouncements.length === 1 ? 'Notice' : 'Notices'}
                    </div>
                </div>

                <div className="space-y-4 flex-1 lg:overflow-y-auto px-1 sm:px-0 lg:pr-3 lg:pl-1 py-1 scrollbar-thin lg:max-h-[700px]">
                    {dayAnnouncements.length > 0 ? (
                        dayAnnouncements.map((a, i) => (
                            <div key={a.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <AnnouncementCard
                                    announcement={a}
                                    onToggleBookmark={toggleBookmark}
                                    basePath="/user"
                                    compact
                                />
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 sm:py-24 lg:py-32 bg-card/20 rounded-3xl border border-dashed border-border/50 text-center px-8 transition-all hover:bg-card/30">
                            <div className="h-16 w-16 rounded-3xl bg-muted/40 flex items-center justify-center mb-6 shadow-inner ring-1 ring-border/50">
                                <CalendarIcon className="h-8 w-8 text-muted-foreground/40" />
                            </div>
                            <p className="text-base font-black text-foreground tracking-tight">
                                No events scheduled
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-3 font-medium leading-relaxed max-w-[200px]">
                                Try selecting another date to explore campus notices.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
