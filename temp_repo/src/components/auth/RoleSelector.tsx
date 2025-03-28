import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UserIcon, TrendingUpIcon } from "lucide-react";

interface RoleSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const RoleSelector = ({
  value = "subscriber",
  onChange = () => {},
  disabled = false,
}: RoleSelectorProps) => {
  return (
    <Card className="p-4 bg-background border border-border">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select your role</h3>
        <RadioGroup
          value={value}
          onValueChange={onChange}
          disabled={disabled}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="subscriber" id="subscriber" className="mt-1">
              <span className="sr-only">Subscriber</span>
            </RadioGroupItem>
            <div className="flex-1">
              <div className="flex items-center">
                <Label
                  htmlFor="subscriber"
                  className="flex items-center space-x-2 text-base font-medium cursor-pointer"
                >
                  <UserIcon className="h-5 w-5 text-primary" />
                  <span>Subscriber</span>
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Copy trades from signal providers and manage multiple trading
                accounts
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <RadioGroupItem value="provider" id="provider" className="mt-1">
              <span className="sr-only">Signal Provider</span>
            </RadioGroupItem>
            <div className="flex-1">
              <div className="flex items-center">
                <Label
                  htmlFor="provider"
                  className="flex items-center space-x-2 text-base font-medium cursor-pointer"
                >
                  <TrendingUpIcon className="h-5 w-5 text-primary" />
                  <span>Signal Provider</span>
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Share your trading strategies and earn from subscribers
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
};

export default RoleSelector;
