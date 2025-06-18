import Image from 'next/image';

export default function TechnologyPartners() {
  return (
    <div className="border-t border-white/10 py-8">
      <div className="text-center mb-6">
        <h4 className="text-sm font-semibold text-slate-400 mb-4">Powered by Leading Web3 Technologies</h4>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="flex items-center space-x-2">
            <Image src="/icons/mantle-network.jpg" alt="Mantle" width={16} height={16} className="w-4 h-4 rounded" />
            <span className="text-sm text-slate-300">Mantle Network</span>
          </div>
          <div className="flex items-center space-x-2">
            <Image src="/icons/vlayer-logo.png" alt="vlayer" width={16} height={16} className="w-4 h-4 rounded" />
            <span className="text-sm text-slate-300">vlayer MailProof</span>
          </div>
          <div className="flex items-center space-x-2">
            <Image src="/icons/merchant-moe.png" alt="Merchant Moe" width={16} height={16} className="w-4 h-4 rounded" />
            <span className="text-sm text-slate-300">Merchant Moe LB</span>
          </div>
          <div className="flex items-center space-x-2">
            <Image src="/icons/thirdweb.png" alt="thirdweb" width={16} height={16} className="w-4 h-4 rounded" />
            <span className="text-sm text-slate-300">thirdweb SDK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
