'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Mail, Gift } from 'lucide-react';
import { useApp } from '@/components/providers';
import { toast } from 'sonner';

interface GiftCard {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  amounts: number[];
}

interface GiftCardCustomizerProps {
  giftCard: GiftCard;
  open: boolean;
  onClose: () => void;
}

const designThemes = [
  { id: 'birthday', name: 'Birthday', preview: '🎂 Happy Birthday! 🎉' },
  { id: 'celebration', name: 'Celebration', preview: '🎉 Congratulations! 🥳' },
  { id: 'holiday', name: 'Holiday', preview: '🎄 Happy Holidays! ❄️' },
  { id: 'thank-you', name: 'Thank You', preview: '💝 Thank You! 🙏' },
  { id: 'classic', name: 'Classic', preview: '🎁 For You! ✨' },
  { id: 'minimal', name: 'Minimal', preview: 'Simple & Elegant' },
];

export function GiftCardCustomizer({ giftCard, open, onClose }: GiftCardCustomizerProps) {
  const { addToCart } = useApp();
  const [amount, setAmount] = useState(giftCard.amounts[0]);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [design, setDesign] = useState('classic');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('now');
  const [scheduledDate, setScheduledDate] = useState('');

  const finalAmount = useCustomAmount ? parseInt(customAmount) || 0 : amount;
  const selectedDesign = designThemes.find(d => d.id === design);

  const handleAddToCart = () => {
    if (finalAmount < 5) {
      toast.error('Minimum gift card amount is $5');
      return;
    }

    if (finalAmount > 2000) {
      toast.error('Maximum gift card amount is $2000');
      return;
    }

    addToCart({
      name: `${giftCard.name} - $${finalAmount}`,
      price: finalAmount,
      type: 'gift-card',
      image: giftCard.image,
      amount: finalAmount,
      design,
      recipientEmail: recipientEmail || undefined,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Gift className="w-6 h-6 text-emerald-600" />
            Customize Your {giftCard.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <div className="space-y-6">
            <Tabs defaultValue="amount" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="amount">Amount</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
              </TabsList>

              <TabsContent value="amount" className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Select Amount</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {giftCard.amounts.map((presetAmount) => (
                      <Button
                        key={presetAmount}
                        variant={!useCustomAmount && amount === presetAmount ? 'default' : 'outline'}
                        onClick={() => {
                          setAmount(presetAmount);
                          setUseCustomAmount(false);
                        }}
                      >
                        ${presetAmount}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">Or Enter Custom Amount</Label>
                  <div className="flex gap-2 mt-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        placeholder="25"
                        min="5"
                        max="2000"
                        className="pl-8"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setUseCustomAmount(true);
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Minimum $5, Maximum $2000</p>
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Choose Design Theme</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {designThemes.map((theme) => (
                      <Card
                        key={theme.id}
                        className={`cursor-pointer transition-all ${
                          design === theme.id 
                            ? 'ring-2 ring-emerald-500 bg-emerald-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setDesign(theme.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{theme.name}</span>
                            <span className="text-sm text-gray-500">{theme.preview}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-base font-semibold">Personal Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write a personal message for the recipient..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2"
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500 mt-1">{message.length}/500 characters</p>
                </div>
              </TabsContent>

              <TabsContent value="delivery" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input
                      id="recipientName"
                      placeholder="Enter recipient's name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipientEmail">Recipient Email</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="recipient@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="senderName">Your Name</Label>
                  <Input
                    id="senderName"
                    placeholder="Enter your name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold">Delivery Schedule</Label>
                  <Select value={deliveryDate} onValueChange={setDeliveryDate}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Send Immediately
                        </div>
                      </SelectItem>
                      <SelectItem value="scheduled">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Schedule for Later
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {deliveryDate === 'scheduled' && (
                    <Input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="mt-2"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Gift Card Preview</Label>
            <Card className="overflow-hidden">
              <div className="relative aspect-[3/2] bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl font-bold mb-2">{giftCard.name}</div>
                  <div className="text-4xl font-bold mb-4">${finalAmount}</div>
                  <div className="text-sm opacity-90">{selectedDesign?.preview}</div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/20 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-white/20 rounded-full"></div>
              </div>
              
              <CardContent className="p-4 bg-white">
                <div className="space-y-3">
                  {recipientName && (
                    <div>
                      <span className="text-sm text-gray-500">To:</span>
                      <div className="font-medium">{recipientName}</div>
                    </div>
                  )}
                  
                  {message && (
                    <div>
                      <span className="text-sm text-gray-500">Message:</span>
                      <div className="text-sm italic">{message}</div>
                    </div>
                  )}
                  
                  {senderName && (
                    <div>
                      <span className="text-sm text-gray-500">From:</span>
                      <div className="font-medium">{senderName}</div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Never Expires
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email Delivery
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">How it works</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Gift card will be sent via email</li>
                    <li>• Recipient can redeem instantly</li>
                    <li>• No expiration date</li>
                    <li>• Can be used online or in-store</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleAddToCart} className="flex-1">
            Add to Cart - ${finalAmount}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}