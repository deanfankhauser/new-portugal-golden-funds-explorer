
import React from 'react';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface QuestionOption {
  value: string;
  label: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface QuestionData {
  key: string;
  title: string;
  subtitle: string;
  helpText: string;
  icon: React.ComponentType<{ className?: string }>;
  isSelect?: boolean;
  options?: QuestionOption[];
  selectOptions?: SelectOption[];
}

interface QuizQuestionProps<T extends FieldValues> {
  question: QuestionData;
  control: Control<T>;
  getFieldError: () => string | undefined;
}

const QuizQuestion = <T extends FieldValues>({ 
  question, 
  control, 
  getFieldError 
}: QuizQuestionProps<T>) => {
  const IconComponent = question.icon;

  return (
    <div className="min-h-[500px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <IconComponent className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{question.title}</h3>
          <p className="text-gray-600">{question.subtitle}</p>
        </div>
        <div className="text-gray-400 hover:text-gray-600 cursor-help" title={question.helpText}>
          <HelpCircle className="w-5 h-5" />
        </div>
      </div>

      {question.helpText && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">{question.helpText}</p>
        </div>
      )}

      <FormField
        control={control}
        name={question.key as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              {question.isSelect ? (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-14 text-left">
                    <SelectValue placeholder={`Select your ${question.key === 'ticketSize' ? 'investment range' : 'citizenship'}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {question.selectOptions?.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-4">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          {option.description && (
                            <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-4"
                >
                  {question.options?.map((option) => (
                    <div key={option.value} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <label htmlFor={option.value} className="font-medium cursor-pointer">
                            {option.label}
                          </label>
                          {option.badge && (
                            <Badge className={`text-xs ${option.badgeColor}`}>
                              {option.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </FormControl>
            {getFieldError() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                <FormMessage className="text-red-600" />
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default QuizQuestion;
