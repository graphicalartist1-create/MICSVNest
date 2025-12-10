import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Settings } from "lucide-react";

interface AdvancedControlsProps {
  onSettingsChange: (settings: GenerationSettings) => void;
}

export interface GenerationSettings {
  titleLength: number;
  keywordCount: number;
  imageType: string;
  prefix: string;
  suffix: string;
  negativeKeywords: string[];
}

export function AdvancedControls({ onSettingsChange }: AdvancedControlsProps) {
  const [titleLength, setTitleLength] = useState(50);
  const [keywordCount, setKeywordCount] = useState(10);
  const [imageType, setImageType] = useState("raster");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [negativeKeywords, setNegativeKeywords] = useState("");

  const handleChange = () => {
    onSettingsChange({
      titleLength,
      keywordCount,
      imageType,
      prefix,
      suffix,
      negativeKeywords: negativeKeywords.split(",").map(k => k.trim()).filter(k => k),
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          উন্নত নিয়ন্ত্রণ
        </CardTitle>
        <CardDescription>
          মেটাডেটা জেনারেশনের জন্য কাস্টম সেটিংস সেট করুন
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* শিরোনাম দৈর্ঘ্য */}
        <div className="space-y-3">
          <Label>শিরোনাম দৈর্ঘ্য: {titleLength} অক্ষর</Label>
          <Slider
            min={10}
            max={255}
            step={5}
            value={[titleLength]}
            onValueChange={(val) => {
              setTitleLength(val[0]);
              handleChange();
            }}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            প্রতিটি শিরোনাম এই সীমার মধ্যে থাকবে
          </p>
        </div>

        {/* কীওয়ার্ড সংখ্যা */}
        <div className="space-y-3">
          <Label>কীওয়ার্ড সংখ্যা: {keywordCount} টি</Label>
          <Slider
            min={1}
            max={50}
            step={1}
            value={[keywordCount]}
            onValueChange={(val) => {
              setKeywordCount(val[0]);
              handleChange();
            }}
            className="w-full"
          />
        </div>

        {/* ইমেজ ধরন */}
        <div className="space-y-2">
          <Label>ইমেজ ধরন</Label>
          <Select value={imageType} onValueChange={(val) => {
            setImageType(val);
            handleChange();
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="raster">রাস্টার (JPG, PNG)</SelectItem>
              <SelectItem value="vector">ভেক্টর (SVG, EPS)</SelectItem>
              <SelectItem value="video">ভিডিও (MP4, etc.)</SelectItem>
              <SelectItem value="mixed">মিশ্র</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* প্রিফিক্স এবং সাফিক্স */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>প্রিফিক্স</Label>
            <Input
              placeholder="যেমন: Stock"
              value={prefix}
              onChange={(e) => {
                setPrefix(e.target.value);
                handleChange();
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>সাফিক্স</Label>
            <Input
              placeholder="যেমন: HD"
              value={suffix}
              onChange={(e) => {
                setSuffix(e.target.value);
                handleChange();
              }}
            />
          </div>
        </div>

        {/* নেগেটিভ কীওয়ার্ড */}
        <div className="space-y-2">
          <Label>নেগেটিভ কীওয়ার্ড (কমা দিয়ে আলাদা করুন)</Label>
          <Input
            placeholder="যেমন: watermark, text, logo"
            value={negativeKeywords}
            onChange={(e) => {
              setNegativeKeywords(e.target.value);
              handleChange();
            }}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            এই কীওয়ার্ডগুলি জেনারেট করা মেটাডেটা থেকে বাদ দেওয়া হবে
          </p>
        </div>

        {/* তথ্য বক্স */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 flex gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900 dark:text-blue-200">
            এই সেটিংসগুলি সব নতুন ফাইলের জন্য প্রয়োগ করা হবে যতক্ষণ আপনি পরিবর্তন করবেন না।
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
