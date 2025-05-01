export function Sucess(message: string, functionName: string='log') {
    functionName === 'log' ? message = `✅ ${message}` : '';
    (console[functionName as keyof Console] as Function)(message);
    return message;
}

export function Info(message: string, functionName: string='log') {
    functionName === 'log' ? message = `🔍 ${message}` : '';
    (console[functionName as keyof Console] as Function)(message);
    return message;
}

export function Warning(message: string, functionName: string='log') {
    functionName === 'log' ? message = `⚠️ ${message}` : '';
    (console[functionName as keyof Console] as Function)(message);
    return message;
}

export function Alert(message: string, functionName: string='log') {
    functionName === 'log' ? message = `🚨 ${message}` : '';
    (console[functionName as keyof Console] as Function)(message);
    return message;
}

export function Error(message: string, functionName: string='log') {
    functionName === 'log' ? message = `❌ ${message}` : '';
    (console[functionName as keyof Console] as Function)(message);
    return message;
} 