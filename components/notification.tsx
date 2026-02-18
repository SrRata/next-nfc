"use client"
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { InternalLink } from "./ui/link"
import { AlertCircle, AlertTriangle, CheckCircle, LucideIcon, XCircle } from "lucide-react"
import { IconColor, IconShape } from "./ui/icon-shape"
import { getRelativeTime } from "@/lib/relative-time"

interface NotificationContainerProps {
  children: React.ReactNode
  className?: string
}

export function NotificationContainer({
  children,
  className
}: NotificationContainerProps) {

  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("bg-white-primary p-6 rounded-primary col-span-3 flex flex-col gap-8", className)}>
      {
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as any, { now })
          }
          return child
        })
      }
    </div>
  )
}


interface NotificationHeaderProps {
  title: string
  description?: string
  href: string
  hrefLabel: string
}


export function NotificationHeader({
    title, 
    description,
    href,
    hrefLabel,
}: NotificationHeaderProps) {
        return (
            <div className="flex items-center justify-between gap-10">
                <div>
                    <h3 className="text-black-primary font-bold text-xl">{title}</h3>
                <p className="text-black-secondary font-medium ">{description}</p>
            </div>
            <InternalLink href={href}>{hrefLabel}</InternalLink>
        </div>

    )
}


interface NotificationItemProps {
  name: string
  message: string
  createdAt: Date
  course: string
  variant: NotificationVariant
  className?: string
}

type NotificationVariant = "info" | "success" | "warning" | "danger";

interface NotificationConfig {
    icon: LucideIcon
    color: IconColor
}

const notificationConfig: Record<NotificationVariant, NotificationConfig> = {
  info: {
    icon: AlertCircle,
    color: "blue",
  },
  success: {
    icon: CheckCircle,
    color: "green",
  },
  warning: {
    icon: AlertTriangle,
    color: "yellow",
  },
  danger: {
    icon: XCircle,
    color: "red",
  },
};

export function NotificationItem({
    name,
    message,
    createdAt,
    course,
    variant,
    className,
}: NotificationItemProps) {
  const { icon: Icon, color } = notificationConfig[variant];
    return (
        <div className={cn("flex items-center justify-between px-5 py-2.5 rounded-primary ease-in-out", className)}>
            <div className="flex items-center gap-5">
                <IconShape 
                    shape="circle" 
                    icon={Icon} 
                    color={color} 
                />
                <div>
                    <p className="text-black-primary font-medium">
                        <span className="font-bold">{name} </span> 
                        {message}
                    </p>
                    <p className="text-black-secondary text-sm font-medium">
                        {getRelativeTime(createdAt)} - {course}
                        </p>
                </div>
            </div>
            <span className="text-black-primary font-semibold">
                {createdAt.toLocaleTimeString("en-Us", { hour: "2-digit", minute: "2-digit", hour12: true,})}
            </span>
        </div>
    )
}
