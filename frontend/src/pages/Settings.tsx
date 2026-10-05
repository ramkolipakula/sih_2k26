import { Settings as SettingsIcon, User, Shield, Bell } from 'lucide-react';

export default function Settings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage account preferences and system configuration.</p>
      </div>

      <div className="grid grid-cols-dashboard">
        <div className="card">
          <h3 className="section-title"><User size={20}/> Profile Settings</h3>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" defaultValue="Dr. Sharma" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" defaultValue="sharma@cmpdi.gov.in" />
          </div>
          <div className="form-group">
            <label className="form-label">Organization</label>
            <input type="text" className="form-control" defaultValue="CMPDI" disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Designation</label>
            <input type="text" className="form-control" defaultValue="Technical Officer" disabled />
          </div>
          
          <button className="btn btn-primary mt-4">Save Changes</button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card">
            <h3 className="section-title"><Shield size={20}/> Security</h3>
            <button className="btn btn-outline w-full mb-3 text-left justify-start">Change Password</button>
            <button className="btn btn-outline w-full text-left justify-start">Two-Factor Authentication</button>
          </div>
          
          <div className="card">
            <h3 className="section-title"><Bell size={20}/> Notifications</h3>
            <div className="flex items-center justify-between mb-3 border-b border-light pb-3">
              <span className="text-sm font-medium">Email Alerts for Reviews</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="flex items-center justify-between mb-3 border-b border-light pb-3">
              <span className="text-sm font-medium">System Update Summaries</span>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
