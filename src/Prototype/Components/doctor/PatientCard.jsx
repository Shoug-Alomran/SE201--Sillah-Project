import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, ArrowRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PatientCard({ patient, familyMembersCount, riskLevel }) {
  const getRiskColor = (level) => {
    const colors = {
      'High': 'bg-red-100 text-red-800 border-red-200',
      'Moderate': 'bg-amber-100 text-amber-800 border-amber-200',
      'Low': 'bg-green-100 text-green-800 border-green-200',
      'None': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[level] || colors['None'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{patient.full_name || 'Unknown'}</h3>
                <p className="text-sm text-gray-500">{patient.email}</p>
              </div>
            </div>
            {riskLevel && riskLevel !== 'None' && (
              <Badge className={getRiskColor(riskLevel)}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {riskLevel} Risk
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {patient.phone_number && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{patient.phone_number}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Joined {new Date(patient.created_date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-600">Family Members</p>
              <p className="text-xl font-bold text-gray-900">{familyMembersCount || 0}</p>
            </div>
            <Link to={createPageUrl('PatientDetail') + `?patientId=${patient.id}&patientEmail=${encodeURIComponent(patient.email)}`}>
              <Button size="sm" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}