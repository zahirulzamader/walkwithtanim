'use client'

import { useEffect, useState } from 'react'
import { Lock, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function AdminLogin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [busy, setBusy] = useState(false)

  const loadStatus = async () => {
    try {
      const res = await fetch('/api/admin')
      const data = await res.json()
      setIsAdmin(Boolean(data?.isAdmin))
    } catch {
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  const handleLogin = async () => {
    if (!passcode.trim()) {
      toast.error('Enter your passcode.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      })
      const data = await res.json()
      if (data?.success) {
        toast.success('Welcome back, admin! You can now write stories.')
        setPasscode('')
        setOpen(false)
        // Reload so the journal section shows the owner-only controls.
        window.location.reload()
      } else {
        toast.error(data?.message ?? 'Incorrect passcode.')
      }
    } catch {
      toast.error('Login failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleLogout = async () => {
    setBusy(true)
    try {
      await fetch('/api/admin', { method: 'DELETE' })
      toast.success('Signed out.')
      setOpen(false)
      window.location.reload()
    } catch {
      toast.error('Could not sign out.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={isAdmin ? 'Admin account' : 'Admin login'}
        title={isAdmin ? 'Admin account' : 'Admin login'}
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
          isAdmin
            ? 'text-primary hover:bg-primary/10'
            : 'text-muted-foreground/40 hover:text-primary'
        }`}
      >
        <Lock size={13} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          {isAdmin ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">You&apos;re signed in</DialogTitle>
                <DialogDescription>
                  You have owner access. The &ldquo;Write Your Story&rdquo; button is visible only to you.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>
                  Close
                </Button>
                <Button onClick={handleLogout} disabled={busy} className="gap-2">
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                  Sign out
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">Admin login</DialogTitle>
                <DialogDescription>
                  Enter your passcode to manage your travel stories. Only you can see this.
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <Label htmlFor="admin-pass">Passcode</Label>
                <Input
                  id="admin-pass"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLogin()
                  }}
                  placeholder="Your private passcode"
                  className="mt-1"
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>
                  Cancel
                </Button>
                <Button onClick={handleLogin} disabled={busy} className="gap-2">
                  {busy ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign in'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
