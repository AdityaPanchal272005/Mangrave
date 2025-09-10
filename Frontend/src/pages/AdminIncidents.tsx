import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  MapPin, 
  Calendar,
  User,
  ChevronDown,
  Clock,
  FileText,
  AlertCircle,
  X,
  Save
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";

interface Incident {
  id: string;
  type: string;
  location: string;
  reporter: string;
  date: string;
  time: string;
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

const mockIncidents: Incident[] = [
  {
    id: 'INC-2024-001',
    type: 'Illegal Logging',
    location: 'Mangrove Sector A-7',
    reporter: 'Marine Bio NGO',
    date: '2024-01-15',
    time: '14:30',
    status: 'new',
    severity: 'high',
    description: 'Large-scale tree cutting observed in protected zone'
  },
  {
    id: 'INC-2024-002',
    type: 'Unauthorized Fishing',
    location: 'Coastal Zone B-12',
    reporter: 'Local Fisherman',
    date: '2024-01-14',
    time: '08:15',
    status: 'investigating',
    severity: 'medium',
    description: 'Commercial fishing nets found in restricted breeding area'
  },
  {
    id: 'INC-2024-003',
    type: 'Pollution Discharge',
    location: 'River Delta C-3',
    reporter: 'EcoGuardians',
    date: '2024-01-13',
    time: '16:45',
    status: 'resolved',
    severity: 'critical',
    description: 'Industrial waste discharge affecting water quality'
  },
  {
    id: 'INC-2024-004',
    type: 'Wildlife Poaching',
    location: 'Protected Area D-9',
    reporter: 'Coastal Watch',
    date: '2024-01-12',
    time: '22:20',
    status: 'investigating',
    severity: 'high',
    description: 'Evidence of bird trapping and habitat destruction'
  },
  {
    id: 'INC-2024-005',
    type: 'Land Reclamation',
    location: 'Mangrove Sector E-4',
    reporter: 'Community Leader',
    date: '2024-01-11',
    time: '10:30',
    status: 'dismissed',
    severity: 'low',
    description: 'Small-scale unauthorized landfill in mangrove area'
  }
];

const StatusBadge = ({ status }: { status: Incident['status'] }) => {
  const variants = {
    new: 'bg-destructive/10 text-destructive border-destructive/20',
    investigating: 'bg-status-warning/10 text-status-warning border-status-warning/20',
    resolved: 'bg-status-success/10 text-status-success border-status-success/20',
    dismissed: 'bg-muted text-muted-foreground border-border'
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const SeverityBadge = ({ severity }: { severity: Incident['severity'] }) => {
  const variants = {
    low: 'bg-status-info/10 text-status-info border-status-info/20',
    medium: 'bg-status-warning/10 text-status-warning border-status-warning/20',
    high: 'bg-reef-orange/10 text-reef-orange border-reef-orange/20',
    critical: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  return (
    <Badge variant="outline" className={variants[severity]}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
};

const IncidentDetailDialog = ({ incident, onUpdate }: { incident: Incident; onUpdate?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newStatus, setNewStatus] = useState(incident.status);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateStatus = async () => {
    if (newStatus === incident.status) {
      toast({
        title: "No Changes",
        description: "Status is already set to this value.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await api.incidents.updateStatus(incident.id, newStatus);
      
      toast({
        title: "Status Updated",
        description: `Incident status updated to ${newStatus}`,
      });
      
      setShowUpdateStatus(false);
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update incident status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) {
      toast({
        title: "Empty Note",
        description: "Please enter a note before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Here you would typically call an API to add a note
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Note Added",
        description: "Note has been added to the incident.",
      });
      
      setNote('');
      setShowAddNote(false);
    } catch (error) {
      toast({
        title: "Failed to Add Note",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowUpdateStatus(false);
    setShowAddNote(false);
    setNote('');
    setNewStatus(incident.status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Incident Details - {incident.id}
          </DialogTitle>
          <DialogDescription>
            Complete information about this reported incident
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Incident Type</label>
                <p className="text-foreground font-medium">{incident.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <p className="text-foreground">{incident.location}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reporter</label>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <p className="text-foreground">{incident.reporter}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <p className="text-foreground">{incident.date} at {incident.time}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <StatusBadge status={incident.status} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Severity</label>
                <div className="mt-1">
                  <SeverityBadge severity={incident.severity} />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Description
            </label>
            <div className="mt-2 p-3 bg-muted/50 rounded-lg border">
              <p className="text-foreground">{incident.description}</p>
            </div>
          </div>

          {/* Update Status Section */}
          {showUpdateStatus && (
            <div className="p-4 bg-muted/30 rounded-lg border">
              <Label htmlFor="status-select">Update Status</Label>
              <div className="flex gap-2 mt-2">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleUpdateStatus} 
                  disabled={loading}
                  size="sm"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowUpdateStatus(false)}
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Add Note Section */}
          {showAddNote && (
            <div className="p-4 bg-muted/30 rounded-lg border">
              <Label htmlFor="note-textarea">Add Note</Label>
              <div className="space-y-2 mt-2">
                <Textarea
                  id="note-textarea"
                  placeholder="Enter your note here..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddNote} 
                    disabled={loading || !note.trim()}
                    size="sm"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-1" />
                    )}
                    Save Note
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddNote(false)}
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {!showUpdateStatus && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowUpdateStatus(true)}
              >
                <Clock className="h-4 w-4 mr-1" />
                Update Status
              </Button>
            )}
            {!showAddNote && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddNote(true)}
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                Add Note
              </Button>
            )}
            <Button 
              size="sm" 
              className="ml-auto"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AdminIncidents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [incidents] = useState<Incident[]>(mockIncidents);
  const [sortBy, setSortBy] = useState<string>('date');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Handle URL query parameters
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setFilterStatus(statusParam);
    }
  }, [searchParams]);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || incident.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Incident Management</h1>
        <p className="text-muted-foreground">Monitor and manage all reported incidents</p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                All Incidents
              </CardTitle>
              <CardDescription>
                {filteredIncidents.length} incidents found
              </CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setFilterStatus(filterStatus === 'all' ? 'new' : 'all')}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="font-semibold">Reporter</TableHead>
                  <TableHead className="font-semibold">Date/Time</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Severity</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => (
                  <TableRow key={incident.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                    <TableCell className="font-medium">{incident.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {incident.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {incident.reporter}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {incident.date} {incident.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={incident.status} />
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={incident.severity} />
                    </TableCell>
                    <TableCell>
                      <IncidentDetailDialog 
                        incident={incident} 
                        onUpdate={() => {
                          // Refresh incidents data if needed
                          console.log('Incident updated, refreshing data...');
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">
                {incidents.filter(i => i.status === 'new').length}
              </p>
              <p className="text-sm text-muted-foreground">New</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-status-warning">
                {incidents.filter(i => i.status === 'investigating').length}
              </p>
              <p className="text-sm text-muted-foreground">Investigating</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-status-success">
                {incidents.filter(i => i.status === 'resolved').length}
              </p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">
                {incidents.filter(i => i.status === 'dismissed').length}
              </p>
              <p className="text-sm text-muted-foreground">Dismissed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};