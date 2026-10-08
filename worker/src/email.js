// 가입자에게 보내는 확인 메일. 메일 클라이언트 호환을 위해 표 레이아웃과 인라인 스타일만 쓴다.
export const WELCOME_SUBJECT = "You're on the Atoll list";

export const WELCOME_TEXT = [
  "Thanks for signing up. We'll write when Atoll is on the App Store, and if we open a beta, you'll hear about that too. Nothing else.",
  "",
  "If this wasn't you, ignore this email or reply and we'll remove your address.",
  "",
  "Atoll · Sydney, Australia · https://tryatoll.app/privacy/",
].join("\n");

export const WELCOME_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>You're on the Atoll list</title>
</head>
<body style="margin:0;padding:0;background:#eef8fb;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">We'll write when Atoll is on the App Store.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef8fb;">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:100%;max-width:480px;">
    <tr><td style="padding:0 8px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="padding-right:10px;"><img src="https://tryatoll.app/icon-192.png" width="32" height="32" alt="" style="display:block;border-radius:9px;border:0;"></td>
        <td style="font-size:20px;font-weight:700;color:#072f40;letter-spacing:-0.01em;">Atoll</td>
      </tr></table>
    </td></tr>
    <tr><td style="background:#ffffff;border:1px solid #d9ebf1;border-radius:24px;padding:36px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#2f5566;">
      <h1 style="margin:0 0 14px;font-size:26px;line-height:1.2;color:#072f40;letter-spacing:-0.02em;">You're on the list.</h1>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#2f5566;">Thanks for signing up. We'll write when Atoll is on the App Store, and if we open a beta, you'll hear about that too. Nothing else.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="background:#e9f7fb;border-radius:16px;padding:16px 18px;font-size:15px;line-height:1.55;color:#072f40;">
          Atoll keeps your distracting apps locked on your schedule. Tap a card you already carry for a 15-minute break, and it locks itself again.
        </td>
      </tr></table>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#58798a;">If this wasn't you, ignore this email or reply and we'll remove your address.</p>
    </td></tr>
    <tr><td align="center" style="padding:20px 8px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#58798a;">
      Atoll · Sydney, Australia<br>
      <a href="https://tryatoll.app/privacy/" style="color:#58798a;">Privacy</a> &nbsp;·&nbsp; <a href="https://tryatoll.app" style="color:#58798a;">tryatoll.app</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
