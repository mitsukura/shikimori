"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    
    // ここで実際のニュースレター登録APIを呼び出します
    // 例: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
    
    // デモ用に遅延を追加
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("ニュースレターに登録しました！", {
      description: `${email}宛に確認メールを送信しました。`,
    });
    
    setEmail("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[768px]">
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "送信中..." : "登録する"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          登録することで、プライバシーポリシーに同意したことになります。
        </p>
      </div>
    </form>
  );
}
