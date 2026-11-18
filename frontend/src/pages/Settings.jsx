import { Settings as SettingsIcon, User } from "lucide-react";
import Card from "../components/common/Card";

function Settings() {
  return (
    <div className="page">
      <div className="page-title">
        <div>
          <span className="eyebrow">ACCOUNT</span>
          <h1>Settings</h1>
          <p>Manage your StudyMate preferences.</p>
        </div>
      </div>

      <Card>
        <div className="settings-row">
          <div className="settings-icon">
            <User size={20} />
          </div>

          <div>
            <strong>Abdul Rafey</strong>
            <p>B.Tech Computer Science • AI & ML</p>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-icon">
            <SettingsIcon size={20} />
          </div>

          <div>
            <strong>Application Settings</strong>
            <p>Theme, preferences and account controls.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Settings;