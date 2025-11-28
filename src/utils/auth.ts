export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = generateUUID();
    localStorage.setItem("device_id", deviceId);
    console.log("새로운 device_id 생성:", deviceId);
  }

  return deviceId;
}

export function isTokenExpired(token: string) {
  if (!token) return true;

  try {
    // JWT는 base64로 인코딩된 3개 부분으로 구성 (header.payload.signature)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // exp는 초 단위이므로 밀리초로 변환

    return Date.now() >= expiry;
  } catch (error) {
    console.error("토큰 파싱 오류:", error);
    return true; // 파싱 실패 시 만료된 것으로 간주
  }
}

export async function guestLogin(deviceid: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/guest-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId: deviceid }),
      }
    );

    if (!response.ok) {
      throw new Error(`Guest 로그인 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.accessToken; // 응답 구조에 맞게 수정 필요
  } catch (error) {
    console.error("Guest 로그인 오류:", error);
    throw error;
  }
}
