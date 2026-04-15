import type { TermsDocument } from './types';

export const TERMS_FIRST_ARTICLE_NUMBER = 1;

export const TERMS_OF_SERVICE: TermsDocument = {
  mainTitle: 'PROMR Performance 이용약관',
  content: [
    {
      kind: 'chapter',
      subheading: '제1장 총 칙',
      paragraphs: [],
    },
    {
      kind: 'article',
      subheading: '(목적)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: '이 약관은 프로엠알(이하 "회사")가 제공하는 PROMR Performance(이하 "서비스")의 이용조건, 절차 및 기타 필요한 사항을 규정함을 목적으로 합니다.',
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(약관의 효력 및 변경)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 이 약관은 서비스를 통하여 이를 공지하거나 전자우편, 기타의 방법으로 회원에게 통지함으로써 효력을 발생합니다
② 회사는 이 약관의 내용을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력을 발생합니다.
③ 회원은 신설 또는 변경된 약관에 동의하지 않을 경우 회원탈퇴를 요청할 수 있으며, 신설 또는 변경된 약관의 효력발생일 이후에도 서비스를 계속 사용할 경우 약관의 변경사항에 동의한 것으로 간주됩니다.`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(약관 이외의 준칙)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: '이 약관에 명시되지 않은 사항이 전기통신기본법, 전기통신사업법, 기타 관련법령에 규정되어 있는 경우 그 규정에 따릅니다.',
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(용어의 정의)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
1. 회원 : 회사와 서비스 이용에 관한 계약을 체결한 자
2. 아이디(ID) : 회원 식별과 회원의 서비스 이용을 위하여 회원이 선정하고 회사가 승인하는 문자와 숫자의 조합
3. 비밀번호 : 회원이 통신상의 자신의 비밀을 보호하기 위해 선정한 문자와 숫자의 조합
4. 전자우편(E-Mail) : 인터넷을 통한 우편
5. 해지 : 회사 또는 회원이 서비스 이용 이후 그 이용계약을 종료시키는 의사표시`,
        },
      ],
    },
    {
      kind: 'chapter',
      subheading: '제2장 서비스 이용계약',
      paragraphs: [],
    },
    {
      kind: 'article',
      subheading: '(이용계약의 성립)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 서비스 가입 신청시 본 약관을 읽고 "동의합니다"의 버튼을 클릭하면 본 약관에 동의하는 것으로 간주됩니다.
② 이용계약은 서비스에 접속한 이용자가 회원가입을 완료하는 시점에 성립합니다.`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(이용신청)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 회원가입 신청양식에 기재하는 모든 회원 정보는 실제 데이터인 것으로 간주됩니다. 실명이나 실제 정보를 입력하지 않은 사용자는 법적인 보호를 받을 수 없으며, 서비스사용의 제한을 받으실 수 있습니다.
③ 회사는 회원의 사업자 여부 및 소속을 확인하기 위하여 사업자등록증 등 관련 서류의 제출을 요구하고 이를 검증할 수 있습니다.`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(이용신청의 승낙)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `①회사는 아래 사항에 해당하는 경우에 그 제한사유가 해소될 때까지 승낙을 유보할 수 있습니다.
1. 서비스 관련 설비에 여유가 없는 경우
2. 기술상 지장이 있는 경우
3. 기타 회사 사정상 필요하다고 인정되는 경우

②회사는 아래 사항에 해당하는 경우에 승낙을 하지 않을 수 있습니다.
1. 다른 사람의 명의를 사용하여 신청한 경우
2. 이용자 정보를 허위로 기재하여 신청한 경우
3. 사회의 안녕질서 또는 미풍양속을 저해할 목적으로 신청한 경우
4. 기타 회사가 정한 이용신청 요건이 미비한 경우`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(회원 아이디(ID)의 변경)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `다음 각 호에 해당하는 경우 회사는 직권 또는 회원의 신청에 의하여 회원 아이디(ID)를 변경할 수 있습니다.
1. 회원 아이디(ID)가 회원의 전화번호, 주민등록번호 등으로 등록되어 있어서 회원의 사생활을 침해할 우려가 있는 경우
2. 타인에게 혐오감을 주거나 미풍양속에 어긋나는 경우
3. 기타 회사 소정의 합리적인 사유가 있는 경우`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(계약의 해지 및 이용제한)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 회원이 서비스 이용계약을 해지하고자 하는 경우에는 본인이 서비스 또는 전자우편을 통하여 회원탈퇴신청을 하여야 하며 회원의 탈퇴신청에 대해 회사는 빠른 시간 내로 탈퇴처리를 할 의무가 있습니다.
② 회원이 사망한 때는 회원자격을 상실합니다.

③ 회사는 회원이 제20조 회원의 의무에 위배되는 행위를 한 경우 사전통지 없이 서비스 이용계약을 해지하거나 회원자격을 적절한 방법으로 제한 및 정지할 수 있습니다.`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(회원 자격 및 회원자격의 해지, 제한, 정지의 절차)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 회사는 제9조 제3항의 규정에 의하여 회원자격을 해지, 제한 또는 정지하고자 하는 경우에는 그 사유, 일시 및 기간을 정하여 전자우편, 서면 또는 전화 등의 방법에 의하여 해당 회원 또는 대리인에게 통지합니다. 다만, 회사가 긴급하게 회원의 서비스 이용을 정지할 필요가 있다고 인정하는 경우에는 그러하지 아니합니다.
② 제1항에 의하여 이용제한의 통지를 받은 회원 또는 그 대리인이 이용제한 통지에 대하여 이의가 있는 경우에는 이의신청을 할 수 있습니다.
③ 회사는 제2항의 규정에 의한 이의신청에 대하여 그 확인을 위한 기간까지 이용제한을 일시 연기할 수 있으며, 그 결과를 이용자 또는 그 대리인에게 통지합니다.
④ 회사는 이용제한기간 중에 그 사유가 해소된 것이 확인된 경우에는 이용제한 조치를 즉시 해제합니다.`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(회원에 대한 통지)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 회사가 회원에 대해 통지를 하는 경우, 회원이 회사에 제출한 전자우편 주소로 할 수 있습니다.
② 회사는 불특정다수 회원에 대한 통지의 경우 서비스 게시판 또는 채팅방에 게시함으로써 개별 통지에 갈음할 수 있습니다.`,
        },
      ],
    },
    {
      kind: 'chapter',
      subheading: '제3장 서비스 제공 및 이용',
      paragraphs: [],
    },
    {
      kind: 'article',
      subheading: '(서비스의 내용 및 이용)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 회사가 제공하는 서비스의 내용은 다음과 같습니다.

나중에 적을게요 12조`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(서비스의 요금)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: '① 회사에서 정한 명시된 유료 정보와 동일합니다.',
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(게시물 관리)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 회사는 회원이 게시한 게시물이 다음 각 호에 해당한다고 판단되는 경우에는 사전 통지 없이 삭제할 수 있습니다.
1. 다른 회원 또는 제3자를 비방하거나 중상모략으로 명예를 손상시키는 내용인 경우
2. 공서양속에 저해되는 내용인 경우
3. 법령에 위배되는 내용인 경우
4. 회사의 저작권, 제3자의 저작권 등 기타 권리를 침해하는 내용인 경우
5. 회사에서 그 밖에 합리적인 판단에 의하여 삭제할 필요가 있다고 인정하는 경우`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(서비스 이용시간)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: '① 서비스는 회사의 업무상 또는 기술상 장애, 기타 특별한 사유가 없는 한 연중무휴, 1일 24시간 이용할 수 있습니다. 다만 설비의 점검 등 회사가 필요한 경우 또는 설비의 장애, 서비스 이용의 폭주 등 불가항력 사항으로 인하여 서비스 이용에 지장이 있는 경우 예외적으로 서비스 이용의 전부 또는 일부에 대하여 제한할 수 있습니다.',
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(정보의 제공)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 회사는 서비스를 운용함에 있어서 각종 정보를 서비스에 게재하는 방법 등으로 회원에게 제공할 수 있습니다.`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(서비스 제공의 중지)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: '① 회사는 다음 각 호에 해당하는 경우 서비스의 제공을 완전히 중지할 수 있습니다.',
        },
        {
          text: `1. 서비스 설비의 보수 등을 위하여 부득이한 경우"
          2. 전기통신 서비스 제공자가 전기통신 서비스를 중지하는 경우
          3. 기타 불가항력적 사유가 있는 경우`,
        },
        {
          text: '② 회사가 통제할 수 없는 사유로 인한 서비스의 중단(시스템 관리자의 고의 및 과실이 없는 디스크 장애, 시스템 다운 혹은 오류 등)으로 인하여 사전 통지가 불가능한 경우에는 이용자에게 사전 통지하지 않아 회원에게 발생한 책임을 지지 않습니다.',
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(회사의 의무)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 회사는 제15조 및 제17조에서 정한 경우를 제외하고 이 약관에서 정한 바에 따라 계속적, 안정적으로 서비스를 제공할 수 있도록 최선의 노력을 다하여야 합니다.
          ② 회사는 서비스에 관련된 설비를 항상 운용할 수 있는 상태로 유지 보수하고, 장애가 발생하는 경우 지체 없이 이를 수리, 복구할 수 있도록 최선의 노력을 다하여야 합니다.
          ③ 회사는 서비스와 관련한 회원의 불만사항이 접수되는 경우 이를 즉시 처리하여야 하며, 즉시 처리가 곤란한 경우 그 사유와 처리 일정을 서비스 또는 전자우편을 통하여 동 회원에게 통지하여야 합니다.
          `,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(보안상 긴급상황)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 보안상 심각하고 시급을 요하는 프로그램 결함이나 장애 혹은 그에 준하는 사건발생 시, 회사에서 고객의 해당 부분을 일괄적으로 패치를 할 수 있습니다.
          ② 보안상 심각하고 시급을 요하는 경우 회사에서 고객의 인증관련 정보를 응급 변경할 수 있읍니다.
          ③ 본조 제①, ②항의 긴급상황 대처 전 회사는 공지나 이메일을 통하여 고객에게 이를 알려야 합니다. 만약 상황이 긴급하여 이를 알리기에 어려움이 있다면, 회사는 대처 후라도 이를 공지나 이메일을 통하여 알려야 합니다.`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '제19조 (개인정보의 보호)',
      paragraphs: [],
    },
    {
      kind: 'article',
      subheading: '(회원의 의무)',
      showClauseIndicator: true,
      paragraphs: [],
    },
    {
      kind: 'article',
      subheading: '제 5 장 기 타',
      paragraphs: [],
    },
    {
      kind: 'article',
      subheading: '(양도금지)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `회원이 서비스의 이용권한, 기타 이용계약상 지위를 타인에게 양도, 증여할 수 없으며, 이를 담보로 제공할 수 없습니다.`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(손해배상)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `회사는 서비스에서 무료로 제공하는 서비스의 이용과 관련하여 개인정보보호정책에서 정하는 내용에 해당하지 않는 사항에 대하여 어떠한 손해도 책임을 지지 않습니다.`,
        },
      ],
    },
    {
      kind: 'article',
      subheading: '(면책)',
      showClauseIndicator: true,
      paragraphs: [],
    },
    {
      kind: 'article',
      subheading: '(분쟁의 조정)',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: `① 회사와 회원은 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여 필요한 모든 노력을 하여야 합니다.
          ② 제1항의 규정에도 불구하고, 동 분쟁으로 인하여 소송이 제기될 경우 동 소송은 회사의 본사소재지를 관할하는 법원의 관할로 합니다.`,
        },
      ],
    },
  ],
};
