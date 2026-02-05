# Payslip Email Sender

*[한국어](#한국어-버전) | English*

A Node.js-based automated system for distributing PDF payslips to employees via Gmail.

## Features

- 📧 Automated email sending via Gmail SMTP
- 📄 PDF payslip attachments
- 👥 JSON-based employee information management
- 📊 Comprehensive result logging
- ⚠️ Error handling and notifications

## Requirements

- Node.js 14.0 or higher
- Gmail account with App Password enabled

## Installation

### 1. Install Node.js

Download and install the latest LTS version from [Node.js official website](https://nodejs.org/).

### 2. Install Dependencies

Run the following command in the project folder:

```bash
npm install
```

This will install the required packages:
- `nodemailer`: Email sending
- `dotenv`: Environment variable management

## Configuration

### 1. Create Gmail App Password

To send emails through Gmail, you need an App Password:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Select **App passwords**
5. Choose app: **Mail**, device: **Windows Computer** (or other)
6. Copy the generated 16-character password (e.g., `abcd efgh ijkl mnop`)

### 2. Set Up Environment Variables

Copy `.env.example` to create `.env`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Windows (CMD)
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edit `.env` file with your information:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
EMAIL_SUBJECT=January 2024 Payslip
COMPANY_NAME=Your Company Name
```

**⚠️ Important**: Never commit the `.env` file to Git! (Already included in `.gitignore`)

### 3. Configure Employee Information

Edit `employees.json` with employee details:

```json
[
  {
    "id": "EMP001",
    "name": "John Doe",
    "email": "john@company.com"
  },
  {
    "id": "EMP002",
    "name": "Jane Smith",
    "email": "jane@company.com"
  }
]
```

**Required fields**:
- `id`: Employee ID (unique)
- `name`: Employee name (must match PDF filename exactly)
- `email`: Employee email address

### 4. Prepare PDF Files

Add payslip PDF files to the `payslips` folder.

**Filename format**: `{name}_{YYYYMM}.pdf`

Example:
```
payslips/
├── John Doe_202401.pdf
├── Jane Smith_202401.pdf
└── ...
```

**Important**: The name portion of the filename must exactly match the `name` field in `employees.json`.

## Usage

Run the program:

```bash
npm start
```

or

```bash
node sendPayslips.js
```

### Example Output

```
=================================================
📧 Automated Payslip Email Sender
=================================================

✅ Configuration validated.

✅ Loaded 3 employees.

✅ Gmail SMTP connection established.

📤 Starting email sending...

📄 Processing: John Doe (john@company.com)
   📎 Attachment: John Doe_202401.pdf
   ✅ Sent successfully

📄 Processing: Jane Smith (jane@company.com)
   📎 Attachment: Jane Smith_202401.pdf
   ✅ Sent successfully

=================================================
📊 Results Summary
=================================================
✅ Success: 2
❌ Failed: 0
⚠️  PDF not found: 0
=================================================

🎉 All payslips sent successfully!
```

## Troubleshooting

### "npm: command not found"

Node.js is not installed or not added to PATH.
- Install Node.js and restart your computer.

### "Environment variables not set"

The `.env` file is missing or incomplete.
- Copy `.env.example` to `.env` and fill in the required information.

### "Invalid login: 535-5.7.8 Username and Password not accepted"

Gmail App Password is incorrect or 2-Step Verification is not enabled.
- Regenerate the Gmail App Password and update the `.env` file.
- Ensure 2-Step Verification is enabled.

### "PDF file not found"

PDF filename doesn't match the employee name in `employees.json`.
- Filename format: `{name}_{YYYYMM}.pdf`
- Verify the name portion matches exactly with `employees.json`.

### Slow sending speed

Gmail has rate limits.
- The code includes a 1-second delay between emails.
- Sending to many employees will take time.

## Project Structure

```
payslip-sender/
├── package.json          # Project configuration
├── .env                  # Environment variables (not committed)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore list
├── employees.json        # Employee information
├── sendPayslips.js       # Main script
├── payslips/             # PDF storage folder
│   ├── .gitkeep
│   └── *.pdf             # Payslip PDF files
└── README.md             # This file
```

## Security Considerations

1. **Protect environment variables**: Never share or commit the `.env` file.
2. **Use App Password**: Use Gmail App Password, not your regular password.
3. **Protect PDF files**: The `payslips/` folder is in `.gitignore`. Handle PDFs with personal information securely.
4. **Test first**: Always test with a test email address before production use.

## Future Improvements

- [ ] Save sending history to CSV or database
- [ ] Enhanced HTML email templates
- [ ] Preview feature before sending
- [ ] Scheduler integration (automatic monthly sending)
- [ ] Automatic retry on failure
- [ ] Support for other email services (Outlook, SendGrid, etc.)

## License

MIT License

## Support

If you encounter issues or have suggestions, please open an issue.

---

# 한국어 버전

# 급여명세서 이메일 자동 전송 프로그램

Node.js 기반으로 PDF 형식의 급여명세서를 직원별로 Gmail을 통해 자동으로 전송하는 프로그램입니다.

## 주요 기능

- 📧 Gmail SMTP를 통한 이메일 자동 전송
- 📄 PDF 급여명세서 첨부
- 👥 JSON 파일 기반 직원 정보 관리
- 📊 전송 결과 요약 및 로깅
- ⚠️ 오류 처리 및 재시도 안내

## 시스템 요구사항

- Node.js 14.0 이상
- Gmail 계정 (앱 비밀번호 필요)

## 설치 방법

### 1. Node.js 설치

[Node.js 공식 웹사이트](https://nodejs.org/)에서 최신 LTS 버전을 다운로드하여 설치합니다.

### 2. 프로젝트 의존성 설치

프로젝트 폴더에서 다음 명령을 실행합니다:

```bash
npm install
```

이 명령은 `package.json`에 정의된 다음 패키지들을 자동으로 설치합니다:
- `nodemailer`: 이메일 전송
- `dotenv`: 환경 변수 관리

## 설정 방법

### 1. Gmail 앱 비밀번호 생성

Gmail을 통해 이메일을 전송하려면 앱 비밀번호가 필요합니다:

1. [Google 계정 설정](https://myaccount.google.com/)으로 이동
2. **보안** 메뉴 선택
3. **2단계 인증** 활성화 (아직 안 했다면)
4. **앱 비밀번호** 메뉴 선택
5. 앱 선택: **메일**, 기기 선택: **Windows 컴퓨터** (또는 기타)
6. 생성된 16자리 비밀번호 복사 (예: `abcd efgh ijkl mnop`)

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성합니다:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Windows (CMD)
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

`.env` 파일을 열어 다음 정보를 입력합니다:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
EMAIL_SUBJECT=2024년 1월 급여명세서
COMPANY_NAME=회사명
```

**⚠️ 중요**: `.env` 파일은 절대 Git에 커밋하지 마세요! (이미 `.gitignore`에 추가되어 있습니다)

### 3. 직원 정보 입력

`employees.json` 파일을 열어 직원 정보를 입력합니다:

```json
[
  {
    "id": "EMP001",
    "name": "홍길동",
    "email": "hong@company.com"
  },
  {
    "id": "EMP002",
    "name": "김철수",
    "email": "kim@company.com"
  }
]
```

**필수 필드**:
- `id`: 직원 사번 (고유값)
- `name`: 직원 이름 (PDF 파일명과 정확히 일치해야 함)
- `email`: 직원 이메일 주소

### 4. PDF 파일 준비

`payslips` 폴더에 급여명세서 PDF 파일을 추가합니다.

**파일명 규칙**: `{이름}_{연월}.pdf`

예시:
```
payslips/
├── 홍길동_202401.pdf
├── 김철수_202401.pdf
└── 이영희_202401.pdf
```

**중요**: 파일명의 이름 부분은 `employees.json`의 `name` 필드와 정확히 일치해야 합니다.

## 사용 방법

### 기본 실행

프로젝트 폴더에서 다음 명령을 실행합니다:

```bash
npm start
```

또는

```bash
node sendPayslips.js
```

### 실행 화면 예시

```
=================================================
📧 급여명세서 이메일 자동 전송 프로그램
=================================================

✅ 환경 설정을 확인했습니다.

✅ 3명의 직원 정보를 로드했습니다.

✅ Gmail SMTP 연결을 설정했습니다.

📤 이메일 전송을 시작합니다...

📄 처리 중: 홍길동 (hong@company.com)
   📎 첨부: 홍길동_202401.pdf
   ✅ 전송 성공

📄 처리 중: 김철수 (kim@company.com)
   📎 첨부: 김철수_202401.pdf
   ✅ 전송 성공

=================================================
📊 전송 결과 요약
=================================================
✅ 성공: 2건
❌ 실패: 0건
⚠️  PDF 없음: 0건
=================================================

🎉 모든 급여명세서가 성공적으로 전송되었습니다!
```

## 문제 해결

### "npm: 명령을 찾을 수 없습니다"

Node.js가 설치되지 않았거나 PATH에 추가되지 않았습니다.
- Node.js를 설치하고 컴퓨터를 재시작하세요.

### "환경 변수가 설정되지 않았습니다"

`.env` 파일이 없거나 필수 정보가 누락되었습니다.
- `.env.example`을 복사하여 `.env` 파일을 생성하고 정보를 입력하세요.

### "Invalid login: 535-5.7.8 Username and Password not accepted"

Gmail 앱 비밀번호가 잘못되었거나 2단계 인증이 활성화되지 않았습니다.
- Gmail 앱 비밀번호를 다시 생성하고 `.env` 파일을 업데이트하세요.
- 2단계 인증이 활성화되어 있는지 확인하세요.

### "PDF 파일을 찾을 수 없습니다"

PDF 파일명이 `employees.json`의 이름과 일치하지 않습니다.
- 파일명 형식: `{이름}_{연월}.pdf`
- 이름 부분이 `employees.json`의 `name`과 정확히 일치하는지 확인하세요.

### 전송 속도가 느립니다

Gmail은 초당 전송 제한이 있습니다.
- 코드에서 각 이메일 전송 후 1초 대기 시간이 설정되어 있습니다.
- 많은 직원에게 전송할 경우 시간이 오래 걸릴 수 있습니다.

## 프로젝트 구조

```
payslip-sender/
├── package.json          # 프로젝트 설정 및 의존성
├── .env                  # 환경 변수 (Git에 커밋 안 됨)
├── .env.example          # 환경 변수 템플릿
├── .gitignore            # Git 제외 파일 목록
├── employees.json        # 직원 정보
├── sendPayslips.js       # 메인 실행 스크립트
├── payslips/             # PDF 파일 저장 폴더
│   ├── .gitkeep
│   └── *.pdf             # 급여명세서 PDF 파일들
└── README.md             # 이 파일
```

## 보안 고려사항

1. **환경 변수 보호**: `.env` 파일은 절대 공유하거나 Git에 커밋하지 마세요.
2. **앱 비밀번호**: Gmail 일반 비밀번호가 아닌 앱 비밀번호를 사용하세요.
3. **PDF 파일 보호**: `payslips/` 폴더는 `.gitignore`에 추가되어 있으며, 개인정보가 포함된 PDF는 안전하게 관리하세요.
4. **이메일 확인**: 전송 전 테스트 이메일 주소로 먼저 테스트해보세요.

## 향후 개선 계획

- [ ] 전송 이력을 CSV나 데이터베이스에 저장
- [ ] HTML 이메일 템플릿 개선
- [ ] 전송 전 미리보기 기능
- [ ] 스케줄러 연동 (매월 자동 전송)
- [ ] 전송 실패 시 자동 재시도
- [ ] 다양한 이메일 서비스 지원 (Outlook, SendGrid 등)

## 라이선스

MIT License

## 문의

문제가 발생하거나 개선 사항이 있으면 이슈를 등록해주세요.
