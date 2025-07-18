import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  Share2, 
  Mail, 
  Link, 
  Eye, 
  Edit, 
  MessageSquare,
  Trash2,
  Plus,
  Copy,
  Check
} from 'lucide-react'
import type { GeneratedContract, Collaborator } from '@/types/contractGeneration'

interface CollaborationPanelProps {
  contract: GeneratedContract
  onUpdateCollaborators: (collaborators: Collaborator[]) => void
}

export function CollaborationPanel({ contract, onUpdateCollaborators }: CollaborationPanelProps) {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'viewer' | 'commenter' | 'editor'>('viewer')
  const [shareLink, setShareLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)

  const collaborators = contract.collaborators || []

  const handleInviteCollaborator = async () => {
    if (!inviteEmail.trim()) return

    const newCollaborator: Collaborator = {
      id: `collab_${Date.now()}`,
      email: inviteEmail,
      role: inviteRole,
      invitedAt: new Date().toISOString(),
      permissions: {
        canView: true,
        canComment: inviteRole !== 'viewer',
        canEdit: inviteRole === 'editor',
        canDownload: inviteRole === 'editor'
      }
    }

    const updatedCollaborators = [...collaborators, newCollaborator]
    onUpdateCollaborators(updatedCollaborators)
    
    // Simulate sending invitation email
    console.log('Sending invitation to:', inviteEmail)
    
    setInviteEmail('')
    setShowInviteModal(false)
  }

  const handleRemoveCollaborator = (collaboratorId: string) => {
    const updatedCollaborators = collaborators.filter(c => c.id !== collaboratorId)
    onUpdateCollaborators(updatedCollaborators)
  }

  const handleUpdateRole = (collaboratorId: string, newRole: 'viewer' | 'commenter' | 'editor') => {
    const updatedCollaborators = collaborators.map(c => 
      c.id === collaboratorId 
        ? {
            ...c,
            role: newRole,
            permissions: {
              canView: true,
              canComment: newRole !== 'viewer',
              canEdit: newRole === 'editor',
              canDownload: newRole === 'editor'
            }
          }
        : c
    )
    onUpdateCollaborators(updatedCollaborators)
  }

  const generateShareLink = async () => {
    setIsGeneratingLink(true)
    
    // Simulate generating a secure share link
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const link = `https://app.legalai.com/shared/${contract.id}?token=abc123xyz`
    setShareLink(link)
    setIsGeneratingLink(false)
  }

  const copyShareLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'editor': return 'bg-green-100 text-green-800'
      case 'commenter': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'editor': return <Edit className="h-3 w-3" />
      case 'commenter': return <MessageSquare className="h-3 w-3" />
      case 'viewer': return <Eye className="h-3 w-3" />
      default: return <Eye className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Collaboration Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Collaboration</span>
              </CardTitle>
              <CardDescription>
                Share and collaborate on this contract with your team
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowInviteModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Invite
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateShareLink}
                disabled={isGeneratingLink}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {isGeneratingLink ? 'Generating...' : 'Share Link'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Share Link */}
      {shareLink && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Link className="h-5 w-5" />
              <span>Share Link</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={copyShareLink}
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Anyone with this link can view the contract. Link expires in 30 days.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Current Collaborators */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Members ({collaborators.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {collaborators.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No collaborators yet</h3>
              <p className="text-gray-600 mb-4">
                Invite team members to review and collaborate on this contract
              </p>
              <Button onClick={() => setShowInviteModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {collaborator.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{collaborator.email}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Invited {new Date(collaborator.invitedAt).toLocaleDateString()}</span>
                        {collaborator.acceptedAt && (
                          <>
                            <span>•</span>
                            <span>Joined {new Date(collaborator.acceptedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={collaborator.role}
                      onChange={(e) => handleUpdateRole(collaborator.id, e.target.value as any)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="commenter">Commenter</option>
                      <option value="editor">Editor</option>
                    </select>
                    
                    <Badge className={getRoleColor(collaborator.role)}>
                      {getRoleIcon(collaborator.role)}
                      <span className="ml-1 capitalize">{collaborator.role}</span>
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permission Levels Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Permission Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Badge className="bg-gray-100 text-gray-800">
                <Eye className="h-3 w-3 mr-1" />
                Viewer
              </Badge>
              <span className="text-sm text-gray-600">Can view the contract only</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-blue-100 text-blue-800">
                <MessageSquare className="h-3 w-3 mr-1" />
                Commenter
              </Badge>
              <span className="text-sm text-gray-600">Can view and add comments</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                <Edit className="h-3 w-3 mr-1" />
                Editor
              </Badge>
              <span className="text-sm text-gray-600">Can view, comment, edit, and download</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Invite Collaborator</span>
              </DialogTitle>
              <DialogDescription>
                Invite a team member to collaborate on this contract
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Permission Level
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="viewer">Viewer - Can view only</option>
                  <option value="commenter">Commenter - Can view and comment</option>
                  <option value="editor">Editor - Full access</option>
                </select>
              </div>
              
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  An invitation email will be sent to the collaborator with a secure link to access the contract.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleInviteCollaborator}
                disabled={!inviteEmail.trim()}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}