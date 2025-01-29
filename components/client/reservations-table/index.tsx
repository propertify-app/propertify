"use client"

import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useEffect, useCallback } from 'react'
import { useState } from 'react'
import { format, isToday, isWeekend, addDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { PlusIcon } from "lucide-react"
import { reservationTableMolecule } from './molecule'
import { useMolecule } from 'bunshi/react'
import { useAtomValue } from 'jotai'

const properties = [
  {
    id: 1,
    name: 'Property 1',
  },
]

export const ReservationsTable = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleDates, setVisibleDates] = useState<Date[]>([])
  const [isLoading, setIsLoading] = useState({ before: false, after: false })
  const dragPosition = useRef({ x: 0, y: 0, top: 0, left: 0 })
 
  // Initialize dates (7 days before and after today)
  useEffect(() => {
    const today = new Date()
    const initial = Array.from({ length: 14 }).map((_, i) => 
      addDays(today, i - 7) // Start 7 days before today
    )
    setVisibleDates(initial)
  }, [])

  const mouseUp = useCallback(() => {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', mouseUp)
  }, [])

  const mouseMove = useCallback((event: MouseEvent) => {
    const dx = event.clientX - dragPosition.current.x
    const dy = event.clientY - dragPosition.current.y
    if(containerRef.current) {
      containerRef.current.scrollTop = dragPosition.current.top - dy
      containerRef.current.scrollLeft = dragPosition.current.left - dx
      containerRef.current.style.userSelect = 'none'
    }
  }, [dragPosition, containerRef])

  const dragToMove = useCallback((event: React.MouseEvent) => {
    dragPosition.current = {
      x: event.clientX,
      y: event.clientY,
      top: containerRef.current?.scrollTop ?? 0,
      left: containerRef.current?.scrollLeft ?? 0,
    }
    if(containerRef.current) {
      containerRef.current.style.userSelect = 'none'
    }
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
    
  }, [containerRef])

  // Column virtualizer
  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: visibleDates.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 120, // estimated column width
    overscan: 5, // number of columns to render outside visible area
  })

  // Row virtualizer
  const rowVirtualizer = useVirtualizer({
    count: properties.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 80, // estimated row height
    overscan: 3, // number of rows to render outside visible area
  })

  // Add this useEffect for infinite scroll
  // useEffect(() => {
  //   const handleIntersection = (direction: 'before' | 'after') => {
  //     setIsLoading(prev => ({ ...prev, [direction]: true }))
      
  //     setVisibleDates(prev => {
  //       if (direction === 'before') {
  //         const newDates = Array.from({ length: 7 }).map((_, i) => 
  //           addDays(prev[0], -(i + 1))
  //         ).reverse()
  //         return [...newDates, ...prev]
  //       } else {
  //         const newDates = Array.from({ length: 7 }).map((_, i) => 
  //           addDays(prev[prev.length - 1], i + 1)
  //         )
  //         return [...prev, ...newDates]
  //       }
  //     })

  //     setIsLoading(prev => ({ ...prev, [direction]: false }))
  //   }

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach(entry => {
  //         if (!entry.isIntersecting) return

  //         const direction = entry.target.classList.contains('sentinel-before') 
  //           ? 'before' 
  //           : 'after'

  //         if (!isLoading[direction]) {
  //           handleIntersection(direction)
  //         }
  //       })
  //     },
  //     { threshold: 0.1 }
  //   )

  //   const beforeSentinel = containerRef.current?.querySelector('.sentinel-before')
  //   const afterSentinel = containerRef.current?.querySelector('.sentinel-after')
    
  //   if (beforeSentinel) observer.observe(beforeSentinel)
  //   if (afterSentinel) observer.observe(afterSentinel)

  //   return () => observer.disconnect()
  // }, [isLoading])

  // Format date with day name and highlight special dates
  const formatDateCell = (date: Date) => {
    return (
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground">
          {format(date, 'EEE')}
        </span>
        <span className={cn(
          "text-sm font-medium",
          isToday(date) && "text-primary",
          isWeekend(date) && "text-muted-foreground"
        )}>
          {format(date, 'MMM d')}
        </span>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-full">
      <div 
        className="w-full overflow-scroll no-scrollbar relative border rounded-lg touch-pan-x scrollbar-thin"
        ref={containerRef}
        onMouseDown={dragToMove}
      >
        <div 
          className="relative min-w-full"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${200 + columnVirtualizer.getTotalSize()}px`,
          }}
        >
          {/* Header row */}
          <div className="sticky top-0 z-20 flex bg-muted/50 backdrop-blur-sm">
            <div className="sticky left-0 z-30 w-[200px] bg-background border-r shadow-sm p-4 font-medium">
              Property
            </div>

            <div 
              className="relative h-[60px]"
              style={{
                width: `${columnVirtualizer.getTotalSize()}px`,
              }}
            >
              {columnVirtualizer.getVirtualItems().map(virtualColumn => {
                const date = visibleDates[virtualColumn.index]
                return (
                  <div
                    key={virtualColumn.index}
                    className={cn(
                      "absolute top-0 h-full border-b border-r flex items-center justify-center",
                      isToday(date) && "bg-primary/5",
                      isWeekend(date) && "bg-muted/50"
                    )}
                    style={{
                      left: `${virtualColumn.start}px`,
                      width: `${virtualColumn.size}px`,
                    }}
                  >
                    {formatDateCell(date)}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sentinels */}
          <div className="absolute left-[100px] top-0 h-full w-5 opacity-0 pointer-events-none sentinel-before" />
          <div className="absolute right-[100px] top-0 h-full w-5 opacity-0 pointer-events-none sentinel-after" />

          {/* Loading indicators */}
          {isLoading.before && (
            <div className="absolute left-0 top-0 h-full w-20 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <div className="animate-spin h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full" />
            </div>
          )}
          {isLoading.after && (
            <div className="absolute right-0 top-0 h-full w-20 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <div className="animate-spin h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
};
