import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import type { AssessmentGroupData } from '@/types/assessments';

interface LetterHeadData {
  data?: {
    letter_head?: string;
  };
}

interface PrintFormatPayload {
  exam_name: string;
  selectedYear: { program: string } | null;
  printFormatMode: 'result' | 'marks';
  assessmentGroupData: AssessmentGroupData;
  letterHeadData: LetterHeadData;
}

interface PrintFormatResponse {
  html: string;
  style: string;
}

export const usePrintFormatMutate = () => {
  return useMutation({
    mutationFn: async ({
      exam_name,
      selectedYear,
      printFormatMode,
      assessmentGroupData,
      letterHeadData,
    }: PrintFormatPayload): Promise<PrintFormatResponse> => {
      const format =
        printFormatMode === 'result'
          ? assessmentGroupData?.custom_print_configuration
          : assessmentGroupData?.result_print_format;
      if (!format) {
        throw new Error('No Result Format');
      }

      const requestData = {
        doc: 'Assessment Result',
        name: exam_name,
        program: selectedYear?.program,
        format,
        no_letterhead: 0,
        letterhead: letterHeadData?.data?.letter_head,
        _lang: 'en',
      };

      const response = await axiosInstance.post(
        `/api/method/frappe.www.printview.get_html_and_style?`,
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'text',
        },
      );
      if (typeof response.data !== 'string' || response.data.trim() === '') {
        throw new Error('Empty response data');
      }

      const data = JSON.parse(response.data);
      const printResp = data?.message;

      if (printResp?.style) {
        const style = document.createElement('style');
        style.innerHTML = printResp.style;
        document.head.appendChild(style);
      }

      return printResp;
    },
  });
};
