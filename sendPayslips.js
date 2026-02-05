require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// 설정 확인
function validateConfig() {
  const required = ['GMAIL_USER', 'GMAIL_APP_PASSWORD', 'EMAIL_SUBJECT'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ 오류: 다음 환경 변수가 설정되지 않았습니다:', missing.join(', '));
    console.error('💡 .env 파일을 확인해주세요.');
    process.exit(1);
  }
}

// Gmail SMTP 전송 설정
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
}

// 직원 정보 로드
function loadEmployees() {
  try {
    const employeesPath = path.join(__dirname, 'employees.json');
    const data = fs.readFileSync(employeesPath, 'utf8');
    const employees = JSON.parse(data);
    
    if (!Array.isArray(employees) || employees.length === 0) {
      throw new Error('직원 정보가 비어있습니다.');
    }
    
    console.log(`✅ ${employees.length}명의 직원 정보를 로드했습니다.`);
    return employees;
  } catch (error) {
    console.error('❌ 직원 정보를 로드하는 중 오류가 발생했습니다:', error.message);
    process.exit(1);
  }
}

// PDF 파일 찾기 (파일명에서 이름 추출하여 매칭)
function findPayslipForEmployee(employeeName) {
  const payslipsDir = path.join(__dirname, 'payslips');
  
  // payslips 폴더가 없으면 생성
  if (!fs.existsSync(payslipsDir)) {
    console.error('❌ payslips 폴더가 존재하지 않습니다. 폴더를 생성해주세요.');
    return null;
  }
  
  try {
    const files = fs.readdirSync(payslipsDir);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    // 파일명 형식: {이름}_{연월}.pdf (예: 홍길동_202401.pdf)
    for (const file of pdfFiles) {
      const namePart = file.split('_')[0]; // 언더스코어 전까지가 이름
      if (namePart === employeeName) {
        return path.join(payslipsDir, file);
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ PDF 파일을 찾는 중 오류가 발생했습니다:`, error.message);
    return null;
  }
}

// 이메일 전송
async function sendPayslipEmail(transporter, employee, pdfPath) {
  const companyName = process.env.COMPANY_NAME || '회사';
  
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: employee.email,
    subject: process.env.EMAIL_SUBJECT,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>안녕하세요, ${employee.name}님</h2>
        <p>첨부된 파일에서 급여명세서를 확인하실 수 있습니다.</p>
        <p>급여명세서는 개인정보가 포함된 중요한 문서이므로 안전하게 보관해 주시기 바랍니다.</p>
        <br>
        <p>문의사항이 있으시면 인사팀으로 연락 주시기 바랍니다.</p>
        <br>
        <p style="color: #666;">감사합니다.<br>${companyName}</p>
      </div>
    `,
    attachments: [
      {
        filename: path.basename(pdfPath),
        path: pdfPath
      }
    ]
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 메인 실행 함수
async function main() {
  console.log('=================================================');
  console.log('📧 급여명세서 이메일 자동 전송 프로그램');
  console.log('=================================================\n');
  
  // 1. 설정 확인
  validateConfig();
  console.log('✅ 환경 설정을 확인했습니다.\n');
  
  // 2. 직원 정보 로드
  const employees = loadEmployees();
  console.log('');
  
  // 3. 이메일 전송 설정
  const transporter = createTransporter();
  console.log('✅ Gmail SMTP 연결을 설정했습니다.\n');
  
  // 4. 각 직원에게 이메일 전송
  console.log('📤 이메일 전송을 시작합니다...\n');
  
  const results = {
    success: [],
    failed: [],
    notFound: []
  };
  
  for (const employee of employees) {
    console.log(`📄 처리 중: ${employee.name} (${employee.email})`);
    
    // PDF 파일 찾기
    const pdfPath = findPayslipForEmployee(employee.name);
    
    if (!pdfPath) {
      console.log(`   ⚠️  PDF 파일을 찾을 수 없습니다.`);
      results.notFound.push(employee);
      console.log('');
      continue;
    }
    
    console.log(`   📎 첨부: ${path.basename(pdfPath)}`);
    
    // 이메일 전송
    const result = await sendPayslipEmail(transporter, employee, pdfPath);
    
    if (result.success) {
      console.log(`   ✅ 전송 성공`);
      results.success.push(employee);
    } else {
      console.log(`   ❌ 전송 실패: ${result.error}`);
      results.failed.push({ employee, error: result.error });
    }
    
    console.log('');
    
    // 서버 부하 방지를 위한 대기 (1초)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 5. 결과 요약
  console.log('=================================================');
  console.log('📊 전송 결과 요약');
  console.log('=================================================');
  console.log(`✅ 성공: ${results.success.length}건`);
  console.log(`❌ 실패: ${results.failed.length}건`);
  console.log(`⚠️  PDF 없음: ${results.notFound.length}건`);
  console.log('=================================================\n');
  
  // 실패 및 누락 상세 정보
  if (results.failed.length > 0) {
    console.log('❌ 전송 실패 목록:');
    results.failed.forEach(({ employee, error }) => {
      console.log(`   - ${employee.name} (${employee.email}): ${error}`);
    });
    console.log('');
  }
  
  if (results.notFound.length > 0) {
    console.log('⚠️  PDF 파일이 없는 직원:');
    results.notFound.forEach(employee => {
      console.log(`   - ${employee.name} (예상 파일명: ${employee.name}_YYYYMM.pdf)`);
    });
    console.log('');
  }
  
  if (results.success.length === employees.length) {
    console.log('🎉 모든 급여명세서가 성공적으로 전송되었습니다!');
  } else {
    console.log('⚠️  일부 전송이 실패했습니다. 위 내용을 확인해주세요.');
  }
}

// 프로그램 실행
main().catch(error => {
  console.error('\n❌ 예상치 못한 오류가 발생했습니다:', error);
  process.exit(1);
});
