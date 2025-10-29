import * as React from "react";

type Language = "en" | "ja";

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations: Record<Language, Record<string, string>> = {
	en: {
		// Header
		"appName": "Slidont",
		"toggleTheme": "Toggle theme",
		"viewSourceCode": "View source code on GitHub",
		
		// Home page
		"realTimeQA": "Real-time Q&A made simple",
		"connectionStatus": "Connection Status",
		"checking": "Checking...",
		"connected": "Connected",
		"error": "Error",
		"cursorTokyoMeetup": "Cursor Tokyo Meetup",
		"joinDescription": "Join the live Q&A session - Ask your questions, vote for your favorites, and engage with the community in real-time.",
		"joinQASession": "Join Session",
		"enterYourName": "Enter Your Name",
		"enterNameToJoin": "Please enter your name to join the Q&A session",
		"enterYourNamePlaceholder": "Enter your name",
		"continue": "Continue",
		"currentName": "Current name",
		"nameSaved": "Name saved successfully!",
		
		// QA page
		"askAQuestion": "Ask a question",
		"yourQuestion": "Your question",
		"submitting": "Submitting...",
		"submit": "Submit",
		"questions": "Questions",
		"noQuestionsYet": "No questions yet. Be the first to ask!",
		"votes": "votes",
		"upvote": "Upvote",
		"downvote": "Downvote",
		"askingAs": "Asking as",
		"anonymous": "Anonymous",
		"presence": "People present",
		"person": "person",
		"people": "people",
		"loading": "Loading...",
		"realtime": "Realtime",
		"top": "Top",
		"pleaseEnterQuestion": "Please enter a question",
		"pleaseEnterName": "Please enter your name",
		"questionPosted": "Question posted!",
		"failedToPost": "Failed to post question",
		"failedToVote": "Failed to vote",
		"failedToFlag": "Failed to flag",
		
		// Buzz
		"buzz": "Buzz",
		"buzzJapanese": "上げ上げ",
		"yourComment": "Your comment",
		"pleaseEnterComment": "Please enter a comment",
		"commentPosted": "Comment posted!",
		"failedToPostComment": "Failed to post comment",
		"noCommentsYet": "No comments yet. Be the first to comment!",
		"autoscroll": "Autoscroll",
		
		// Presenter page
		"presenterMode": "Presenter Mode",
		"noQuestionsFound": "No questions found",
		"markAnswered": "Mark as Answered",
		"delete": "Delete",
		"toggleAnswer": "Toggle Answer",
		"answered": "Answered",
		"unanswered": "Unanswered",
		"loading": "Loading...",
		"unauthorized": "Unauthorized",
		"noAccess": "You don't have access to this presenter view.",
		"pending": "pending",
		"noQuestionsYet": "No questions yet",
		"askAway": "Ask away!",
		"done": "Done",
		"eventNotFound": "Event not found",
		"eventDoesNotExist": "The event you're looking for doesn't exist.",
		"settingUpSession": "Setting up your Q&A session...",
	},
	ja: {
		// Header
		"appName": "Slidont",
		"toggleTheme": "テーマを切り替え",
		"viewSourceCode": "GitHubでソースコードを表示",
		
		// Home page
		"realTimeQA": "リアルタイムQ&Aをシンプルに",
		"connectionStatus": "接続ステータス",
		"checking": "確認中...",
		"connected": "接続済み",
		"error": "エラー",
		"cursorTokyoMeetup": "Cursor Tokyo Meetup",
		"joinDescription": "ライブQ&Aセッションに参加 - 質問を投稿し、お気に入りに投票し、リアルタイムでコミュニティと交流しましょう。",
		"joinQASession": "Q&Aセッションに参加",
		"enterYourName": "お名前を入力",
		"enterNameToJoin": "Q&Aセッションに参加するには、お名前を入力してください",
		"enterYourNamePlaceholder": "お名前を入力",
		"continue": "続ける",
		"currentName": "現在の名前",
		"nameSaved": "名前を保存しました！",
		
		// QA page
		"askAQuestion": "質問する",
		"yourQuestion": "質問内容",
		"submitting": "送信中...",
		"submit": "送信",
		"questions": "質問",
		"noQuestionsYet": "まだ質問がありません。最初の質問を投稿しましょう！",
		"votes": "票",
		"upvote": "投票",
		"downvote": "投票を取り消す",
		"askingAs": "投稿者",
		"anonymous": "匿名",
		"presence": "参加者",
		"person": "人",
		"people": "人",
		"loading": "読み込み中...",
		"realtime": "リアルタイム",
		"top": "トップ",
		"pleaseEnterQuestion": "質問を入力してください",
		"pleaseEnterName": "名前を入力してください",
		"questionPosted": "質問を投稿しました！",
		"failedToPost": "質問の投稿に失敗しました",
		"failedToVote": "投票に失敗しました",
		"failedToFlag": "フラグに失敗しました",
		
		// Buzz
		"buzz": "Buzz",
		"buzzJapanese": "上げ上げ",
		"yourComment": "つぶやき",
		"pleaseEnterComment": "つぶやきを入力してください",
		"commentPosted": "つぶやきを投稿しました！",
		"failedToPostComment": "つぶやきの投稿に失敗しました",
		"noCommentsYet": "まだつぶやきがありません。最初のつぶやきを投稿しましょう！",
		"autoscroll": "自動スクロール",
		
		// Presenter page
		"presenterMode": "プレゼンターモード",
		"noQuestionsFound": "質問が見つかりません",
		"markAnswered": "回答済みにする",
		"delete": "削除",
		"toggleAnswer": "回答の切り替え",
		"answered": "回答済み",
		"unanswered": "未回答",
		"loading": "読み込み中...",
		"unauthorized": "認証されていません",
		"noAccess": "このプレゼンタービューにアクセスできません。",
		"pending": "保留中",
		"noQuestionsYet": "まだ質問がありません",
		"askAway": "質問をどうぞ！",
		"done": "完了",
		"eventNotFound": "イベントが見つかりません",
		"eventDoesNotExist": "お探しのイベントは存在しません。",
		"settingUpSession": "Q&Aセッションを設定中...",
	},
};

function getBrowserLanguage(): Language {
	if (typeof window === "undefined") return "en";
	const browserLang = navigator.language.toLowerCase();
	return browserLang.startsWith("ja") ? "ja" : "en";
}

function getStoredLanguage(): Language | null {
	if (typeof window === "undefined") return null;
	const stored = localStorage.getItem("slidont-language");
	return stored === "ja" || stored === "en" ? stored : null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [language, setLanguageState] = React.useState<Language>(() => {
		return getStoredLanguage() || getBrowserLanguage();
	});

	const setLanguage = React.useCallback((lang: Language) => {
		setLanguageState(lang);
		localStorage.setItem("slidont-language", lang);
	}, []);

	const t = React.useCallback(
		(key: string) => {
			return translations[language][key] || key;
		},
		[language]
	);

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = React.useContext(LanguageContext);
	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
}

