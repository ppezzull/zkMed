import { Badge } from '@/components/ui/badge';

export default function BottomBar() {
  return (
    <div className="border-t border-white/10 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
          <span>© 2024 zkMed. All rights reserved.</span>
          <div className="flex items-center space-x-4">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              🧪 Testnet Development
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              🛡️ SOC 2 Planning
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              🔐 HIPAA Ready
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-slate-400">Built with ❤️ for global healthcare</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-orange-400">Testnet operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
