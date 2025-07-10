export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Kebijakan Privasi</h1>
      <div className="space-y-4 text-base leading-relaxed">
        <p>Kami menghargai privasi Anda. Berikut adalah kebijakan privasi untuk penggunaan Bisa Website:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Data yang Anda masukkan hanya digunakan untuk keperluan pengembangan dan peningkatan layanan.</li>
          <li>Kami tidak membagikan data pribadi Anda kepada pihak ketiga tanpa izin Anda.</li>
          <li>Informasi yang dikumpulkan dapat berupa data penggunaan, log aktivitas, dan input yang Anda berikan ke sistem.</li>
          <li>Kami menggunakan teknologi keamanan untuk melindungi data Anda dari akses yang tidak sah.</li>
          <li>Anda dapat menghubungi kami jika ingin menghapus data atau memiliki pertanyaan terkait privasi.</li>
        </ul>
        <p>Dengan menggunakan layanan ini, Anda menyetujui kebijakan privasi yang berlaku.</p>
      </div>
    </main>
  );
}
