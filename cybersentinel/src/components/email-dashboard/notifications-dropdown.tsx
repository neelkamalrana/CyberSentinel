"use client"

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Notification, notificationsStore } from '@/lib/notifications-store';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Load notifications on component mount
  useEffect(() => {
    const loadNotifications = () => {
      const allNotifications = notificationsStore.getNotifications();
      setNotifications(allNotifications);
      setUnreadCount(notificationsStore.getUnreadCount());
    };

    // Load initially
    loadNotifications();

    // Set up interval to check for new notifications
    const interval = setInterval(loadNotifications, 5000);

    // Set up storage event listener to update when another tab modifies localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cybersentinel_notifications') {
        loadNotifications();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    // Clean up
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle dropdown open/close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    
    // Mark all as read when opening the dropdown
    if (open && unreadCount > 0) {
      notificationsStore.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  // Get appropriate icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'phishing':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // If the notification has an emailId, navigate to the dashboard
    if (notification.emailId) {
      router.push('/?emailId=' + notification.emailId);
    }
    
    // Close the dropdown
    setIsOpen(false);
  };

  // Clear all notifications
  const handleClearAll = () => {
    notificationsStore.clearAllNotifications();
    setNotifications([]);
    setUnreadCount(0);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No notifications</p>
          </div>
        ) : (
          notifications.slice(0, 20).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-2">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 space-y-1">
                  <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
        
        {notifications.length > 20 && (
          <div className="p-2 text-center text-muted-foreground text-xs">
            + {notifications.length - 20} more notifications
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}