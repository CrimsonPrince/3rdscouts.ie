export type ScoutFormType = 'youth' | 'adult' | 'hall' | 'contact';

interface AppsScriptResponse {
  ok?: boolean;
  error?: string;
}

function buildMailtoHref(
  recipient: string,
  subjectPrefix: string,
  readableBody: string,
  topicValue: FormDataEntryValue | null
): string {
  const resolvedPrefix = topicValue ? String(topicValue).trim() : subjectPrefix;
  const subject = encodeURIComponent(`${resolvedPrefix} – 3rdscouts.ie`);
  const body = encodeURIComponent(readableBody);
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

function setStatusWithMailtoFallback(
  statusEl: HTMLElement | null,
  statusClass: 'form-status--success' | 'form-status--error',
  prefixText: string,
  mailtoHref: string,
  linkText: string
): void {
  if (!statusEl) return;
  statusEl.className = `form-status ${statusClass} is-visible`;
  statusEl.replaceChildren();

  const text = document.createTextNode(prefixText);
  const link = document.createElement('a');
  link.href = mailtoHref;
  link.textContent = linkText;
  link.style.fontWeight = '700';
  link.style.textDecoration = 'underline';
  statusEl.append(text, link, document.createTextNode('.'));
}

export function wireMailtoForm(
  formId: string,
  subjectPrefix: string,
  defaultRecipient: string,
  draftLabel: string,
  formType: ScoutFormType = 'contact'
): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;

  const statusEl = form.querySelector('.form-status') as HTMLElement | null;
  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  const defaultBtnLabel = submitBtn ? submitBtn.textContent || 'Submit' : 'Submit';
  const recipient = form.dataset.mailto || defaultRecipient;
  const resolvedType = (form.dataset.formType as ScoutFormType | undefined) || formType;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const honeypot = String(data.get('_gotcha') || '').trim();
    if (honeypot) {
      // Silently ignore automated spam submissions.
      form.reset();
      return;
    }

    const lines: string[] = [];
    const fields: string[] = [];
    const fieldMap: Record<string, string> = {};

    for (const [key, value] of data.entries()) {
      if (key === '_gotcha') continue;
      const text = String(value).trim();
      fieldMap[key] = text;
      fields.push(text);
      if (text) lines.push(`${key}: ${text}`);
    }

    const readableBody = lines.join('\n');
    const mailtoHref = buildMailtoHref(
      recipient,
      subjectPrefix,
      readableBody,
      data.get('Topic')
    );

    const endpoint = (
      form.dataset.endpoint ||
      import.meta.env.PUBLIC_APPS_SCRIPT_URL ||
      ''
    ).trim();

    if (!endpoint) {
      setStatusWithMailtoFallback(
        statusEl,
        'form-status--success',
        `Your ${draftLabel} for ${recipient} is ready. If your email app does not open automatically, `,
        mailtoHref,
        'click here to open your email draft'
      );
      window.location.href = mailtoHref;
      return;
    }

    const replyTo = fieldMap['Email Address'] || recipient;
    const summaryName =
      fieldMap['Parent Name'] || fieldMap['Name'] || fieldMap['Name / Group Name'] || '';
    const topic = fieldMap['Topic'];

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }
    if (statusEl) {
      statusEl.className = 'form-status';
      statusEl.textContent = '';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          formType: resolvedType,
          subjectPrefix: topic || subjectPrefix,
          replyTo,
          summaryName,
          fields,
          fieldMap,
          readableBody,
          honeypot: '',
        }),
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = (await response.json()) as AppsScriptResponse;
      if (!result || result.ok !== true) {
        throw new Error(result?.error || 'Unexpected server response');
      }

      form.reset();
      if (statusEl) {
        statusEl.className = 'form-status form-status--success is-visible';
        statusEl.textContent =
          'Thank you! Your submission has been saved. Our team will be in touch soon.';
      }
    } catch {
      setStatusWithMailtoFallback(
        statusEl,
        'form-status--error',
        `We could not submit the form automatically right now. Please email ${recipient} directly — `,
        mailtoHref,
        'click here to open your pre-filled email draft'
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultBtnLabel;
      }
    }
  });
}
